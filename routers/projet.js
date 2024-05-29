const projetCtrl = require("../controllers/projet");
const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/add", auth, projetCtrl.addProjet);
router.get("/", auth, projetCtrl.getAllProjets);
router.patch("/:id", auth, projetCtrl.updateProjet);
router.delete("/:id", auth, projetCtrl.deleteProjet);

module.exports = router;
