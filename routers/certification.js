const certificationCtrl = require("../controllers/certification");
const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/add", auth, certificationCtrl.addCertification);
router.get("/", auth, certificationCtrl.getAllCertifications);
router.patch("/:id", auth, certificationCtrl.updateCertification);
router.delete("/:id", auth, certificationCtrl.deleteCertification);

module.exports = router;
