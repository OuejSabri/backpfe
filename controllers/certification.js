const Certification = require("../models/certification");
const { validationResult } = require("express-validator"); // Assuming you're using express-validator for input validation

// Add Certification
exports.addCertification = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: "error", errors: errors.array() });
    }

    const { domain, date } = req.body;
    const userId = req.user._id;

    const certification = await Certification.create({
      user: userId,
      domain,
      date,
    });

    res.status(201).json({ status: "success", data: certification });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};

// Get All Certifications
exports.getAllCertifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const certifications = await Certification.find({ user: userId });

    res.status(200).json({ status: "success", data: certifications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};

// Update Certification
exports.updateCertification = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: "error", errors: errors.array() });
    }

    const userId = req.user._id;
    const certification = await Certification.findOneAndUpdate(
      { _id: req.params.id, user: userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!certification) {
      return res
        .status(404)
        .json({
          status: "error",
          message: "No certification with that ID found for this user",
        });
    }

    res.status(200).json({ status: "success", data: certification });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};

// Delete Certification
exports.deleteCertification = async (req, res) => {
  try {
    const userId = req.user._id;
    const certification = await Certification.findOneAndDelete({
      _id: req.params.id,
      user: userId,
    });

    if (!certification) {
      return res
        .status(404)
        .json({
          status: "error",
          message: "No certification with that ID found for this user",
        });
    }

    res.status(200).json({ status: "success", data: null });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};
