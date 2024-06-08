const express = require("express");
const router = express.Router();
const profilCntrl = require("../controllers/profil");
const profilSCntrl = require("../controllers/profileSociete");
const auth = require("../middleware/auth");
// routers pour gerer le profil
router.post("/creerProfil", auth, profilCntrl.creerProfil);
router.put("/updateProfil/:id", auth, profilCntrl.updateProfil);
router.get("/profils", auth, profilCntrl.getProfils);
router.get("/getprofil/:id", auth, profilCntrl.getProfil); 
router.get("/getOne/:id", auth, profilCntrl.getOne); //
router.delete("/supprimerProfil", auth, profilCntrl.deleteProfil);


router.post("/creerProfilSociete", auth, profilSCntrl.creerProfilSociete);
router.put("/updateProfileSociete/:id", auth, profilSCntrl.updateProfileSociete);
router.get("/getSocieteProfils", auth, profilSCntrl.getSocieteProfils);
router.get("/getProfileSociete/:id", auth, profilSCntrl.getProfileSociete);
router.get("/getProfSociete/:id", auth, profilSCntrl.getProfSociete);

module.exports = router;
