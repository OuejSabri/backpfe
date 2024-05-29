const express = require('express');
const attestationController = require('../controllers/attestationController');
const upload=require('../utils/upload')
const router = express.Router();

// Point de terminaison pour créer une nouvelle attestation
router.post("/",upload.fields([{ name: 'attestation', maxCount: 1 }]), attestationController.createAttestation);

// Point de terminaison pour télécharger une attestation par son ID
router.get("/:id", attestationController.getAttestation);

module.exports = router;
