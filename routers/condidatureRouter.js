const express = require('express');
const router = express.Router();
const CandidatureController = require('../controllers/condidatureController');


// Créer une nouvelle candidature
router.post("/", CandidatureController.createCandidature);
router.delete("/:id", CandidatureController.deleteCondidature);
// Obtenir la liste de toutes les candidatures
router.get("/", CandidatureController.getAllCandidatures);
router.get("/getAllMesCandidatures/:id", CandidatureController.getAllMesCandidatures);
router.get("/getMesCandidatures/:id", CandidatureController.getMesCandidatures);
router.get("/candidature/:id", CandidatureController.getCandidature);
router.put("/accepter/:id", CandidatureController.accepterCandidature)
router.put("/refuser/:id", CandidatureController.refuserCandidature);

// Accepter une candidature
router.put("/:candidatureId/accept", CandidatureController.acceptCandidature);

// Refuser une candidature
router.put("/:candidatureId/reject", CandidatureController.rejectCandidature);



// Obtenir la liste des stagiaires acceptés
router.get("/accepted", CandidatureController.getStagiairesAcceptes);
router.get("/accepted/:id", CandidatureController.getStagiairesAcceptesByid);

router.get("/:id", CandidatureController.getAcceptesByid);
module.exports = router;

