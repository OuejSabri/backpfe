const Offre = require("../models/offre");
const Post = require("../models/postuler");

exports.publierOffre = async (req, res) => {
  try {
    const {
      societe,
      titre,
      description,
      technologies,
      lieu,
      date_dexpiration,
      duree,
      number_candidats,
      domaine,
      status,
    } = req.body;
    const newOffre = await Offre.create({
      societe,
      titre,
      description,
      technologies,
      lieu,
      date_dexpiration,
      duree,
      number_candidats,
      domaine,
      status,
    });
    res.json({
      status: "success",
      data: newOffre,
      msg: `${newOffre.titre} créé avec succès à la base de données !`,
    });
  } catch (err) {
    console.log(err);
  }
};
exports.getAllOffres = async (req, res) => {
  try {
    const offres = await Offre.find().populate([
      {
        path: "societe",
        model: "user",
        select: "nom telephone role email _id",
      },
    ]);
    res.status(200).send(offres);
  } catch (err) {
    console.log(err);
  }
};

exports.getOneOffre = async (req, res) => {
  try {
    const id = req.params.id;
    const offres = await Offre.findById(id).populate([
      {
        path: "societe",
        model: "user",
        select: "nom telephone role email _id",
      },
    ]);;
    res.status(200).send(offres);
    console.log(offres);
  } catch (err) {
    console.log(err);
  }
};

exports.getAllMesOffres = async (req, res) => {
  const { id } = req.params;

  try {
    const offres = await Offre.find({ societe: id }).populate([
      {
        path: "societe",
        model: "user",
      }]);
    res.status(200).json({
      status: "success",
      data: offres,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Erreur lors de la récupération des offres",
    });
  }
};

exports.modifierOffre = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      titre,
      description,
      technologies,
      lieu,
      date_dexpiration,
      duree,
      number_candidats,
      domaine,
      status,
    } = req.body;
    const newdata = {};
    if (titre !== "") newdata.titre = titre;
    if (description !== "") newdata.description = description;
    if (technologies !== "") newdata.technologies = technologies;
    if (lieu !== "") newdata.lieu = lieu;
    if (date_dexpiration !== "") newdata.date_dexpiration = date_dexpiration;
    if (duree !== "") newdata.duree = duree;
    if (number_candidats !== "") newdata.number_candidats = number_candidats;
    if (domaine !== "") newdata.domaine = domaine;
    if (status !== "") newdata.status = status;
    const offre = await Offre.findByIdAndUpdate(
      id,
      { $set: newdata },
      { new: true, runValidators: true }
    );
    if (!offre) {
      return res.status(404).json({
        status: "error",
        message: "Offre non trouvée",
      });
    }
    res.status(200).json({ status: "success", data: offre });
  } catch (err) {
    res.status(404).json({
      status: "error",
      message: "Erreur lors de la modification de l'offre",
    });
    console.log(err);
  }
};

exports.deleteOffre = async (req, res) => {
  try {
    const { id } = req.params;
    const offre = await Offre.findByIdAndDelete(id);
    res.send(`${id} supprimé avec succès `);
    res.status(204).json({
      status: "success",
      message: `${id} supprimé avec succès `,
      data: null,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postulerOffre = async (req, res) => {
  try {
    const { nom, email, cv, lettre_motivation, date_debut, date_fin, status } =
      req.body;
    const post = new Post({
      nom,
      email,
      cv,
      lettre_motivation,
      date_debut,
      date_fin,
      status,
    });
    const newpost = await post.save();
    res.status(201).send({ msg: `${post.id} enregistré avec succès  !` });
  } catch (err) {
    console.log(err);
  }
};

exports.mespostulations = async (req, res) => {
  try {
    const posts = await Post.find();
    return res.status(200).send(posts);
  } catch (err) {
    console.log(err);
    return res.status(422).send(err);
  }
};
exports.modifierPostul = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );
    if (!post) return res.status(404).send("post non trouvé");
    res.status(200).send({ msg: "modification effectuée avec succés!" });
  } catch (err) {
    console.log(err);
  }
};
exports.supprimerPostul = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).send("post non trouvé");
    res.status(200).send({ msg: "Suppression réussie" });
  } catch (err) {
    console.log(err);
  }
};

exports.searchOffers = async (req, res) =>{
  const searchCriteria = req.body;
  // Création d'un objet de filtre
  const filter = {};

  if (searchCriteria.societe) {
    filter.societe = searchCriteria.societe;
  }
  if (searchCriteria.titre) {
    filter.titre = { $regex: searchCriteria.titre, $options: 'i' };  // Recherche insensible à la casse
  }
  if (searchCriteria.description) {
    filter.description = { $regex: searchCriteria.description, $options: 'i' };
  }
  if (searchCriteria.technologies && searchCriteria.technologies.length > 0) {
    filter.technologies = { $all: searchCriteria.technologies };
  }
  if (searchCriteria.lieu) {
    filter.lieu = { $regex: searchCriteria.lieu, $options: 'i' };
  }
  if (searchCriteria.domaine) {
    filter.domaine = { $regex: searchCriteria.domaine, $options: 'i' };
  }
  if (searchCriteria.date_dexpiration) {
    filter.date_dexpiration = { $lte: new Date(searchCriteria.date_dexpiration) };
  }
  if (searchCriteria.duree) {
    filter.duree = searchCriteria.duree;
  }
  if (searchCriteria.number_candidats !== undefined) {
    filter.number_candidats = { $gte: searchCriteria.number_candidats };
  }
  if (searchCriteria.status) {
    filter.status = searchCriteria.status;
  }

  // Exécution de la requête
  try {
    const offers = await Offre.find(filter).populate("societe");
    // res.status(200).json(offers);
        res.status(200).json({
          status: "success",
          message: `search avec succès `,
          data: offers,
        });
  } catch (error) {
    console.error("Error searching offers:", error);
    res
      .status(500)
      .json({status:'error', error: "An error occurred while searching for offers." });
  }
}

