import Donation from "../models/Donation.js";
import { createNotification } from "./notificationController.js";

const CHAPA_BASE = "https://api.chapa.co/v1";

function generateTxRef() {
  return `church-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

async function chapaRequest(endpoint, { method = "GET", body } = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    const opts = {
      method,
      headers: {
        Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      signal: controller.signal,
    };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch(`${CHAPA_BASE}${endpoint}`, opts);
    return res.json();
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * @desc    Initialize a Chapa payment
 * @route   POST /api/donations/initialize
 * @access  Public
 */
export const initializePayment = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, amount, donationType } = req.body;

    if (!firstName || !lastName || !email || !amount) {
      return res.status(400).json({
        message: "Please provide firstName, lastName, email, and amount",
      });
    }

    if (amount < 1) {
      return res.status(400).json({ message: "Amount must be at least 1 ETB" });
    }

    const txRef = generateTxRef();

    const chapaPayload = {
      amount: String(amount),
      currency: "ETB",
      email,
      first_name: firstName,
      last_name: lastName,
      phone_number: phone || "",
      tx_ref: txRef,
      callback_url: `${process.env.CHAPA_CALLBACK_URL || `${process.env.CLIENT_URL}/api/donations/callback`}`,
      return_url: `${process.env.CLIENT_URL || "http://localhost:3000"}/give/success?tx_ref=${txRef}`,
      "customization[title]": "Church Donation",
      "customization[description]": `${donationType || "one-time"} donation`,
    };

    const chapaRes = await chapaRequest("/transaction/initialize", {
      method: "POST",
      body: chapaPayload,
    });

    if (chapaRes.status !== "success") {
      return res.status(400).json({
        message: chapaRes.message || "Failed to initialize payment with Chapa",
      });
    }

    await Donation.create({
      firstName,
      lastName,
      email,
      phone,
      amount,
      donationType: donationType || "one-time",
      txRef,
      status: "pending",
    });

    res.json({
      checkoutUrl: chapaRes.data.checkout_url,
      txRef,
    });
  } catch (error) {
    console.error("Initialize payment error:", error);
    const isNetwork = error.cause?.code === "UND_ERR_CONNECT_TIMEOUT" || error.name === "AbortError";
    res.status(500).json({
      message: isNetwork
        ? "Cannot reach Chapa servers. Please check your internet connection and try again."
        : "Server error",
      error: error.message,
    });
  }
};

/**
 * @desc    Verify a Chapa payment
 * @route   GET /api/donations/verify/:txRef
 * @access  Public
 */
export const verifyPayment = async (req, res) => {
  try {
    const { txRef } = req.params;

    const donation = await Donation.findOne({ txRef });
    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    if (donation.status === "success") {
      return res.json({ status: "success", donation });
    }

    const chapaRes = await chapaRequest(`/transaction/verify/${txRef}`);

    if (chapaRes.status === "success" && chapaRes.data?.status === "success") {
      donation.status = "success";
      donation.chapaRef = chapaRes.data.reference;
      donation.paymentMethod = chapaRes.data.payment_type || "chapa";
      await donation.save();
      createNotification({
        type: "donation",
        title: "New Donation Received",
        message: `ETB ${donation.amount.toLocaleString()} from ${donation.firstName} ${donation.lastName}`,
        relatedId: donation._id,
        relatedModel: "Donation",
      });
      return res.json({ status: "success", donation });
    }

    if (chapaRes.data?.status === "failed") {
      donation.status = "failed";
      await donation.save();
    }

    res.json({
      status: donation.status,
      donation,
    });
  } catch (error) {
    console.error("Verify payment error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc    Chapa webhook callback
 * @route   POST /api/donations/callback
 * @access  Chapa servers
 */
export const chapaCallback = async (req, res) => {
  try {
    const { tx_ref, status, reference } = req.body;

    if (!tx_ref) {
      return res.status(400).json({ message: "Missing tx_ref" });
    }

    const donation = await Donation.findOne({ txRef: tx_ref });
    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    if (status === "success") {
      donation.status = "success";
      donation.chapaRef = reference || "";
      await donation.save();
      createNotification({
        type: "donation",
        title: "New Donation Received",
        message: `ETB ${donation.amount.toLocaleString()} from ${donation.firstName} ${donation.lastName}`,
        relatedId: donation._id,
        relatedModel: "Donation",
      });
    } else {
      donation.status = "failed";
      await donation.save();
    }

    res.status(200).json({ message: "Callback received" });
  } catch (error) {
    console.error("Chapa callback error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc    Get all donations
 * @route   GET /api/donations
 * @access  Admin only
 */
export const getDonations = async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    res.json(donations);
  } catch (error) {
    console.error("Get donations error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc    Get donation stats for admin dashboard
 * @route   GET /api/donations/stats
 * @access  Admin only
 */
export const getDonationStats = async (req, res) => {
  try {
    const totalDonations = await Donation.countDocuments({ status: "success" });

    const totalAmountResult = await Donation.aggregate([
      { $match: { status: "success" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalAmount = totalAmountResult[0]?.total || 0;

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyResult = await Donation.aggregate([
      { $match: { status: "success", createdAt: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const monthlyTotal = monthlyResult[0]?.total || 0;

    const last6Months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      last6Months.push({
        start: d,
        end,
        label: d.toLocaleString("default", { month: "short", year: "numeric" }),
      });
    }

    const monthlyTrend = await Promise.all(
      last6Months.map(async ({ start, end, label }) => {
        const result = await Donation.aggregate([
          { $match: { status: "success", createdAt: { $gte: start, $lt: end } } },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]);
        return { month: label, amount: result[0]?.total || 0 };
      })
    );

    res.json({
      totalDonations,
      totalAmount,
      monthlyTotal,
      monthlyTrend,
    });
  } catch (error) {
    console.error("Get donation stats error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc    Delete a donation record
 * @route   DELETE /api/donations/:id
 * @access  Admin only
 */
export const deleteDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }
    await donation.deleteOne();
    res.json({ message: "Donation record deleted" });
  } catch (error) {
    console.error("Delete donation error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
