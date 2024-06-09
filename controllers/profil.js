const Profil = require("../models/profil");

exports.creerProfil = async (req, res) => {
  try {
    const { fullName, nationality, dateOfBirth, address, department, gender } =
      req.body;
    const userId = req.user._id; // Use req.user._id from authenticated user

    const profil = await Profil.create({
      user: userId,
      fullName,
      nationality,
      dateOfBirth,
      address,
      department,
      gender,
    });

    return res.status(201).json({ status: "success", data: profil });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};

exports.getProfils = async (req, res) => {
  try {
    const profils = await Profil.find().populate("user");
    if (!profils || profils.length === 0) {
      return res.status(404).json({ message: "Aucun profil trouvé." });
    }
    return res.status(200).json({ status: "success", data: profils });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};

exports.getProfil = async (req, res) => {
  try {
    const userId = req.user._id;
    const profil = await Profil.findOne({ user: userId }).populate("user");
    if (!profil) {
      try {
        const userId = req.user._id;
        const profil = await Profil.create({
          user: userId,
        });

        return res.status(201).json({ status: "success", data: profil });
      } catch (err) {
        console.error(err);
        res
          .status(500)
          .json({ status: "error", message: "Internal Server Error" });
      }
    }

    return res.status(200).json({
      status: "success",
      message: "Profil trouvé avec succès",
      data: profil,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};
exports.getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const profil = await Profil.findOne({ user: id }).populate([
      {
        path: "user",
        model: "user",
      },
    ]);
    if (!profil) {
      return res
        .status(404)
        .json({ message: "Aucun profil trouvé avec l'identifiant fourni" });
    }

    return res.status(200).json({
      status: "success",
      message: "Profil trouvé avec succès",
      data: profil,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};
exports.updateProfil = async (req, res) => {
  try {
    const userId = req.user._id;
    const profil = await Profil.findOneAndUpdate({ user: userId }, req.body, {
      new: true,
      runValidators: true,
    });
    if (!profil) {
       const profil = await Profil.create({
        user: userId,
      });
      return res.status(201).json({ status: "success", data: profile });
    }
    return res.status(200).json({
      status: "success",
      message: "Le profil a bien été modifié",
      data: profil,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};

exports.deleteProfil = async (req, res) => {
  try {
    const userId = req.user._id;
    const profil = await Profil.findOneAndDelete({ user: userId });
    if (!profil) {
      return res.status(404).json({ message: "Le Profil n'a pas été trouvé" });
    }
    return res.status(200).json({ message: "Le Profil a été supprimé" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};
