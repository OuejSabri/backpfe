const express = require("express");
const affectationCtrl = require("../controllers/affectation");
const router = express.Router();

router.get("/generateAffectation/:id", affectationCtrl.generateAffectation);
router.get("/downloadAffectation/:id", affectationCtrl.downloadAffectation);

module.exports = router;
