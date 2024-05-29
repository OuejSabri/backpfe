const Education = require("../models/education");

exports.addEducation = async (req, res) => {
  try {
    const { institut, domaineEtude, dateDebut, dateFin } = req.body;
    const userId = req.user._id; // Use req.user._id

    const education = await Education.create({
      user: userId,
      institut,
      domaineEtude,
      dateDebut,
      dateFin,
    });

    res.status(201).json({ status: "success", data: education });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};

// Get All Educations

exports.getAllEducations = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming user ID is available in req.user
    const educations = await Education.find({ user: userId });
    res.status(200).json({ status: "success", data: educations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};

// Update Education
exports.updateEducation = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming user ID is available in req.user
    const education = await Education.findOneAndUpdate(
      { _id: req.params.id, user: userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!education) {
      return res
        .status(404)
        .json({
          status: "error",
          message: "No education with that ID found for this user",
        });
    }

    res.status(200).json({ status: "success", data: education });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};

// Delete Education
exports.deleteEducation = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming user ID is available in req.user
    const education = await Education.findOneAndDelete({
      _id: req.params.id,
      user: userId,
    });

    if (!education) {
      return res
        .status(404)
        .json({
          status: "error",
          message: "No education with that ID found for this user",
        });
    }

    res.status(200).json({ status: "success", data: null });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};
