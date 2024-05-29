const Candidature = require("../models/condidature");
const User = require("../models/user");
const sendEmail = require("../utils/sendMail");

// Créer une nouvelle candidature
exports.createCandidature = async (req, res) => {
  // Récupérer également l'ID de l'offre de stage depuis le corps de la requête
  const {
    stagiaire,
    nom,
    email,
    cv,
    lettre_motivation,
    date_debut,
    date_fin,
    datePostulation,
    status,
    offreStage,
  } = req.body;
  const candida = await Candidature.create({
    stagiaire,
    nom,
    email,
    cv,
    lettre_motivation,
    date_debut,
    date_fin,
    datePostulation,
    status,
    offreStage,
  });
  // Créer la candidature avec l'ID de l'offre de stage
  const candidat = await candida.save();
  res.status(201).json({ status: "success", data: candidat });
};
exports.accepterCandidature = async (req, res) => {
  const { id } = req.params;

  try {
    const candida = await Candidature.findByIdAndUpdate(id, {
      status: "accepter",
    });

    if (!candida) {
      return res.status(404).json({ message: "Candidature non trouvée" });
    }

    // Enregistrez les modifications
    await candida.save();

    res.status(200).json({ message: "Candidature modifiée avec succès" });
  } catch (error) {
    console.error("Erreur lors de la modification de la candidature :", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la modification de la candidature" });
  }
};
exports.refuserCandidature = async (req, res) => {
  const { id } = req.params;

  try {
    const candida = await Candidature.findByIdAndUpdate(id, {
      status: "refuser",
    });

    if (!candida) {
      return res.status(404).json({ message: "Candidature non trouvée" });
    }

    // Enregistrez les modifications
    await candida.save();

    res.status(200).json({ message: "Candidature modifiée avec succès" });
  } catch (error) {
    console.error("Erreur lors de la modification de la candidature :", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la modification de la candidature" });
  }
};
exports.getCandidature = async (req, res) => {
  const { id } = req.params;
  const candidature = await Candidature.findOne(id);
  if (!candidature) {
    return res.status(404).json({ message: "Candidature non trouvée" });
  }
  res.status(200).json({ status: "success", data: candidature });
};
// Obtenir la liste de toutes les candidatures
exports.getAllCandidatures = async (req, res) => {
  const candidatures = await Candidature.find().populate(
    "stagiaire offreStage"
  );
  return res.status(200).json({ status: "success", data: candidatures });
};
exports.getAllMesCandidatures = async (req, res) => {
  const { id } = req.params;
  const candidatures = await Candidature.find({ stagiaire: id }).populate([
    {
      path: "stagiaire",
      model: "user",
    },
    {
      path: "offreStage",
      model: "offre",
      populate: "societe",
    },
  ]);
  return res.status(200).json({ status: "success", data: candidatures });
};
exports.getMesCandidatures = async (req, res) => {
  const { id } = req.params;
  const candidatures = await Candidature.find({ societe: id }).populate([
    {
      path: "stagiaire",
      model: "user",
    },
    {
      path: "offreStage",
      model: "offre",
      populate: "societe",
    },
  ]);
  return res.status(200).json({ status: "success", data: candidatures });
};

exports.deleteCondidature = async (req, res) => {
  try {
    const id = req.params.id;
    const candidature = await Candidature.findByIdAndDelete(id);
    return res.status(200).json({ status: "success", data: candidature });
  } catch (error) {
    return res.status(422).send(error);
  }
};

// Accepter une candidature
exports.acceptCandidature = async (req, res, next) => {
  const { candidatureId } = req.params;

  // Mettre à jour le statut de la candidature
  const updatedCandidature = await Candidature.findByIdAndUpdate(
    candidatureId,
    { action: "accepted", societeNotified: false },
    { new: true }
  );

  if (!updatedCandidature) {
    return res
      .status(404)
      .json({ status: "filed", data: "Candidature non trouvée." });
  }

  // Envoyer un e-mail à l'societe
  try {
    const societe = await User.findOne({ role: "societe" }); // Trouver la societe par son rôle
    if (!societe) {
      return res.status(404).json({ message: "L'societe n'existe pas" });
    }

    const message = `Bonjour ${societe.fullName}, une nouvelle candidature a été acceptée. Veuillez contacter le stagiaire ${updatedCandidature.stagiaire.nom} (${updatedCandidature.stagiaire.email}) pour organiser un entretien.`;
    await sendEmail(societe.email, "Candidature Acceptée", message);

    // Marquer l'societe comme notifié
    updatedCandidature.societeNotified = true;
    await updatedCandidature.save();

    res
      .status(200)
      .json({ status: "success", data: { candidature: updatedCandidature } });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Une erreur est survenue lors de lenvoi l'e-mail à la societe .",
    });
  }
};
// Refuser une candidature
exports.rejectCandidature = async (req, res) => {
  const { candidatureId } = req.params;

  // Mettre à jour le statut de la candidature
  const updatedCandidature = await Candidature.findByIdAndUpdate(
    candidatureId,
    { action: "rejected" },
    { new: true }
  );

  if (!updatedCandidature) {
    return res
      .status(400)
      .json({ status: "filed", data: "Candidature non trouvée." });
  }

  res.status(200).json({ status: "success", data: updatedCandidature });
};
// Obtenir la liste des stagiaires acceptés
exports.getStagiairesAcceptes = async (res) => {
  try {
    const stagiairesAcceptes = await Candidature.find({
      status: "accepter",
    }).populate([
      {
        path: "stagiaire",
        model: "user",
      },
      {
        path: "offreStage",
        model: "offre",
        populate: "societe",
      },
    ]);
    res.status(200).json({ status: "success", data: stagiairesAcceptes });
  } catch (err) {
    console.log(err);
  }
};
exports.getStagiairesAcceptesByid = async (req, res) => {
  try {
    const id = req.params.id;
    const stagiairesAcceptes = await Candidature.findOne({
      status: "accepter",
      stagiaire: id,
    }).populate([
      {
        path: "stagiaire",
        model: "user",
        select: "nom telephone role email _id",
      },
      {
        path: "offreStage",
        model: "offre",
        populate: "societe",
      },
    ]);
    return res
      .status(200)
      .send({ status: "success", data: stagiairesAcceptes });
  } catch (err) {
    return res.status(422).send(err);
  }
};
exports.getAcceptesByid = async (req, res, next) => {
  try {
    const id = req.params.id;
    const stagiairesAcceptes = await Candidature.findOne({
      status: "accepter",
      _id: id,
    }).populate([
      {
        path: "stagiaire",
        model: "user",
        select: "nom telephone role email _id",
      },
      {
        path: "offreStage",
        model: "offre",
        populate: "societe",
      },
    ]);
    res.status(200).json({ status: "success", data: stagiairesAcceptes });
  } catch (err) {
    return res.status(422).send(err);
  }
};
