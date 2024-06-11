const express = require("express");
const routers = express.Router();
const offreCtrl = require("../controllers/offre");

const profilCntrl = require("../controllers/profil");
const validate = require("../middleware/validate-inputs");

routers.post("/publierOffre", offreCtrl.publierOffre);
routers.post("/search-offers", offreCtrl.searchOffers);
routers.get("/getAllOffres", offreCtrl.getAllOffres);
routers.get("/findAll", offreCtrl.findAll);
routers.get("/getOneOffre/:id", offreCtrl.getOneOffre);
routers.get("/getAllMesOffres/:id", offreCtrl.getAllMesOffres);
routers.put("/modifierOffre/:id", offreCtrl.modifierOffre);
routers.delete("/supprimerOffre/:id", offreCtrl.deleteOffre);

routers.post("/postulerOffre", offreCtrl.postulerOffre);
routers.get("/allPostulations", offreCtrl.mespostulations);
// routers.get('/:id', offreCtrl.postt);
routers.put("/modifierPostul/:id", offreCtrl.modifierPostul);
routers.delete("/supprimerPostul/:id", offreCtrl.supprimerPostul);

module.exports = routers;
