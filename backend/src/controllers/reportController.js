import Donation from "../models/Donation.js";
import Event from "../models/Event.js";
import Sermon from "../models/Sermon.js";
import Contact from "../models/Contact.js";
import Registration from "../models/Registration.js";

export const getDonationReport = async (req, res) => {
  try {
    const { startDate, endDate, type, status } = req.query;
    const match = {};
    if (status && status !== "all") {
      match.status = status;
    }

    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        match.createdAt.$lte = end;
      }
    }
    if (type && type !== "all") match.donationType = type;

    const [donations, aggregation, byType, byMonth] = await Promise.all([
      Donation.find(match).sort({ createdAt: -1 }).limit(500),
      Donation.aggregate([
        { $match: match },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
            count: { $sum: 1 },
            avg: { $avg: "$amount" },
            max: { $max: "$amount" },
            min: { $min: "$amount" },
          },
        },
      ]),
      Donation.aggregate([
        { $match: match },
        { $group: { _id: "$donationType", total: { $sum: "$amount" }, count: { $sum: 1 } } },
      ]),
      Donation.aggregate([
        { $match: match },
        {
          $group: {
            _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
            total: { $sum: "$amount" },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]),
    ]);

    const summary = aggregation[0] || { total: 0, count: 0, avg: 0, max: 0, min: 0 };
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyData = byMonth.map((m) => ({
      month: `${monthNames[m._id.month - 1]} ${m._id.year}`,
      total: m.total,
      count: m.count,
    }));

    const topDonors = await Donation.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$email",
          name: { $first: { $concat: ["$firstName", " ", "$lastName"] } },
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
      { $limit: 10 },
    ]);

    res.json({
      donations,
      summary: { total: summary.total, count: summary.count, average: Math.round(summary.avg), max: summary.max, min: summary.min },
      byType,
      monthlyData,
      topDonors,
    });
  } catch (error) {
    console.error("Donation report error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getOverviewReport = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    const [
      totalDonationsThisMonth,
      totalDonationsLastMonth,
      totalEventsUpcoming,
      totalSermonsThisMonth,
      totalContactsThisMonth,
      totalContactsLastMonth,
      totalRegistrationsThisMonth,
      donationAmountThisMonth,
      donationAmountLastMonth,
      totalDonationsAllTime,
      totalEventsAllTime,
      totalSermonsAllTime,
      totalContactsAllTime,
    ] = await Promise.all([
      Donation.countDocuments({ status: "success", createdAt: { $gte: startOfMonth } }),
      Donation.countDocuments({ status: "success", createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } }),
      Event.countDocuments({ date: { $gte: now } }),
      Sermon.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Contact.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Contact.countDocuments({ createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } }),
      Registration.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Donation.aggregate([
        { $match: { status: "success", createdAt: { $gte: startOfMonth } } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Donation.aggregate([
        { $match: { status: "success", createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Donation.aggregate([
        { $match: { status: "success" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Event.countDocuments(),
      Sermon.countDocuments(),
      Contact.countDocuments(),
    ]);

    const thisMonthAmt = donationAmountThisMonth[0]?.total || 0;
    const lastMonthAmt = donationAmountLastMonth[0]?.total || 0;
    const donationChange = lastMonthAmt > 0 ? Math.round(((thisMonthAmt - lastMonthAmt) / lastMonthAmt) * 100) : 0;
    const contactChange = totalContactsLastMonth > 0 ? Math.round(((totalContactsThisMonth - totalContactsLastMonth) / totalContactsLastMonth) * 100) : 0;

    res.json({
      thisMonth: {
        donations: { count: totalDonationsThisMonth, amount: thisMonthAmt, change: donationChange },
        events: { upcoming: totalEventsUpcoming },
        sermons: { count: totalSermonsThisMonth },
        contacts: { count: totalContactsThisMonth, change: contactChange },
        registrations: { count: totalRegistrationsThisMonth },
      },
      allTime: {
        donations: totalDonationsAllTime[0]?.total || 0,
        events: totalEventsAllTime,
        sermons: totalSermonsAllTime,
        contacts: totalContactsAllTime,
      },
      generatedAt: now.toISOString(),
    });
  } catch (error) {
    console.error("Overview report error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
