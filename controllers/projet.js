const Projet = require("../models/projet");

exports.addProjet = async (req, res) => {
  try {
    const { titre, description, date } = req.body;
    const userId = req.user._id; // Use req.user._id

    const projet = await Projet.create({
      user: userId,
      titre,
      description,
      date,
    });

    res.status(201).json({ status: "success", data: projet });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};

exports.getAllProjets = async (req, res) => {
  try {
    const userId = req.user._id; // Use req.user._id
    const projets = await Projet.find({ user: userId });
    res.status(200).json({ status: "success", data: projets });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};

exports.updateProjet = async (req, res) => {
  try {
    const userId = req.user._id; // Use req.user._id
    const projet = await Projet.findOneAndUpdate(
      { _id: req.params.id, user: userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!projet) {
      return res
        .status(404)
        .json({
          status: "error",
          message: "Aucun projet trouvé avec cet ID pour cet utilisateur",
        });
    }

    res.status(200).json({ status: "success", data: projet });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};

exports.deleteProjet = async (req, res) => {
  try {
    const userId = req.user._id; // Use req.user._id
    const projet = await Projet.findOneAndDelete({
      _id: req.params.id,
      user: userId,
    });

    if (!projet) {
      return res
        .status(404)
        .json({
          status: "error",
          message: "Aucun projet trouvé avec cet ID pour cet utilisateur",
        });
    }

    res.status(200).json({ status: "success", data: null });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};
