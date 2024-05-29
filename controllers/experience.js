const Experience = require("../models/experience");

exports.addExperience = async (req, res) => {
  try {
    const { entreprise, poste, dateDebut, dateFin, description } = req.body;
    const userId = req.user._id; // Use req.user._id

    const experience = await Experience.create({
      user: userId,
      entreprise,
      poste,
      dateDebut,
      dateFin,
      description,
    });

    res.status(201).json({ status: "success", data: experience });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};

exports.getAllExperiences = async (req, res) => {
  try {
    const userId = req.user._id; // Use req.user._id
    const experiences = await Experience.find({ user: userId });
    res.status(200).json({ status: "success", data: experiences });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};

exports.updateExperience = async (req, res) => {
  try {
    const userId = req.user._id; // Use req.user._id
    const experience = await Experience.findOneAndUpdate(
      { _id: req.params.id, user: userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!experience) {
      return res
        .status(404)
        .json({
          status: "error",
          message: "No experience with that ID found for this user",
        });
    }

    res.status(200).json({ status: "success", data: experience });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};

exports.deleteExperience = async (req, res) => {
  try {
    const userId = req.user._id; // Use req.user._id
    const experience = await Experience.findOneAndDelete({
      _id: req.params.id,
      user: userId,
    });

    if (!experience) {
      return res
        .status(404)
        .json({
          status: "error",
          message: "No experience with that ID found for this user",
        });
    }

    res.status(200).json({ status: "success", data: null });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};
