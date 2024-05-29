const Profil = require("../models/profil");
const User = require("../models/user")
exports.creerProfil = async (req, res) => {
  try {
    const {
      user,
      carte_identite,
      prenom,
      date_naissance,
      sexe,
      adresse,
      ville,
      matricule_fiscale,
      domaine,
      code_postal,
      fax,
      site_web,
      description,
      cin,
      cv,
      etablissement,
    } = req.body;
    const profil = await Profil.create({
      user,
      carte_identite,
      prenom,
      date_naissance,
      sexe,
      adresse,
      ville,
      matricule_fiscale,
      domaine,
      code_postal,
      fax,
      site_web,
      description,
      cin,
      cv,
      etablissement,
    });
    return res.status(201).json({ status: "success", data: profil });
  } catch (err) {
    console.log(err);
  }
};
exports.getProfils = async (req, res) => {
  try {
    const profils = await Profil.find().populate('user')
    if (!profils || profils.length == 0)
      return res.status(404).json({ message: "Aucun profil trouvé." });
    else return res.status(200).json({ status: "success", data: profils });
  } catch (err) {
    console.log(err);
  }
};
exports.getProfil = async (req, res) => {
  try {
    const id = req.params.id;
    const profil = await Profil.findOne({ user: id }).populate('user');
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
    console.log(err);
  }
};
exports.updateProfil = async (req, res) => {
  try {
    const id = req.params.id;
    const profil = await Profil.findByIdAndUpdate(id, req.body);
    if (!profil) return res.status(404).send("profil non trouvé");
    return res.status(201).json({ message: "Le profil a bien été modifié" });
  } catch (err) {
    console.log(err);
  }
};
exports.deleteProfil = async (req, res) => {
  try {
    const id = req.params.id;
    const profil = await Profil.findByIdAndDelete(id);
    if (profil === null) {
      console.log("Profil not found!");
      return res.status(400).send("Le Profil n'a pas été trouvé");
    } else {
      res.status(200).json({ message: "Le Profil a été supprimée" });
    }
  } catch (err) {
    console.log(err);
  }
};
exports.modifierMdp = async (req, res) => {};
