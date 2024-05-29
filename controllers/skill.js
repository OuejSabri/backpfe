const Skill = require("../models/skill");

exports.addSkill = async (req, res) => {
  try {
    const { nom, niveau } = req.body;
    const userId = req.user._id; // Use req.user._id

    const skill = await Skill.create({
      user: userId,
      nom,
      niveau,
    });

    res.status(201).json({ status: "success", data: skill });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};

exports.getAllSkills = async (req, res) => {
  try {
    const userId = req.user._id; // Use req.user._id
    const skills = await Skill.find({ user: userId });
    res.status(200).json({ status: "success", data: skills });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};

exports.updateSkill = async (req, res) => {
  try {
    const userId = req.user._id; // Use req.user._id
    const skill = await Skill.findOneAndUpdate(
      { _id: req.params.id, user: userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!skill) {
      return res
        .status(404)
        .json({
          status: "error",
          message: "Aucune compétence trouvée avec cet ID pour cet utilisateur",
        });
    }

    res.status(200).json({ status: "success", data: skill });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};

exports.deleteSkill = async (req, res) => {
  try {
    const userId = req.user._id; // Use req.user._id
    const skill = await Skill.findOneAndDelete({
      _id: req.params.id,
      user: userId,
    });

    if (!skill) {
      return res
        .status(404)
        .json({
          status: "error",
          message: "Aucune compétence trouvée avec cet ID pour cet utilisateur",
        });
    }

    res.status(200).json({ status: "success", data: null });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};
