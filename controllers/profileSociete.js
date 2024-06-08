const ProfileSociete = require("../models/profilSociete");

exports.creerProfilSociete = async (req, res) => {
  try {
    const {
      adresse,
      ville,
      matricule_fiscale,
      domaine,
      code_postal,
      fax,
      site_web,
      description,
    } = req.body;
    const userId = req.user._id;

    const profil = await ProfileSociete.create({
      user: userId,
      adresse,
      ville,
      matricule_fiscale,
      domaine,
      code_postal,
      fax,
      site_web,
      description,
    });

    return res.status(201).json({ status: "success", data: profil });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};
exports.updateProfileSociete = async (req, res) => {
  try {
    const userId = req.user._id;
    const profil = await ProfileSociete.findOneAndUpdate(
      { user: userId },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!profil) {
      const profile = await ProfileSociete.create({
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
exports.getProfileSociete = async (req, res) => {
  try {
    const userId = req.user._id;
    const profil = await ProfileSociete.findOne({ user: userId }).populate(
      "user"
    );
    if (!profil) {
      try {
        const userId = req.user._id;
        const profil = await ProfileSociete.create({
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
exports.getProfSociete = async (req, res) => {
  try {
    const { id } = req.params;
    const profil = await ProfileSociete.findOne({ user: id }).populate([
      {
        path: "user",
        model: "user",
      },
    ]);
    if (!profil) {
      try {
        const userId = req.user._id;
        const profil = await ProfileSociete.create({
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
exports.getSocieteProfils = async (req, res) => {
  try {
    const profils = await ProfileSociete.find().populate("user");
    if (!profils || profils.length === 0) {
      return res.status(404).json({ message: "Aucun profil trouvé." });
    }
    return res.status(200).json({ status: "success", data: profils });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};
