import Service from "../models/Service.js";

export const getServices = async (req, res) => {
  try {
    const { type } = req.query;
    const filter = { isActive: true };
    if (type) filter.type = type;

    const services = await Service.find(filter)
      .populate("createdBy", "name email")
      .sort({ order: 1, createdAt: -1 });

    res.json(services);
  } catch (error) {
    console.error("Get services error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json(service);
  } catch (error) {
    console.error("Get service error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const createService = async (req, res) => {
  try {
    const { title, titleAmharic, description, descriptionAmharic, day, time, endTime, location, type, imageUrl, order } = req.body;

    if (!title || !description || !day || !time) {
      return res.status(400).json({
        message: "Please provide title, description, day, and time",
      });
    }

    const service = await Service.create({
      title,
      titleAmharic,
      description,
      descriptionAmharic,
      day,
      time,
      endTime,
      location,
      type,
      imageUrl,
      order,
      createdBy: req.user._id,
    });

    await service.populate("createdBy", "name email");
    res.status(201).json(service);
  } catch (error) {
    console.error("Create service error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const fields = ["title", "titleAmharic", "description", "descriptionAmharic", "day", "time", "endTime", "location", "type", "imageUrl", "isActive", "order"];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        service[field] = req.body[field];
      }
    });

    const updatedService = await service.save();
    await updatedService.populate("createdBy", "name email");

    res.json(updatedService);
  } catch (error) {
    console.error("Update service error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    await service.deleteOne();
    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    console.error("Delete service error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
