const cvCtrl = require("../controllers/cv");
const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/add", cvCtrl.createCv);
router.get("/getAllCvs", cvCtrl.getAllCvs);
router.patch("/updateCV/:id", cvCtrl.updateCV);
router.delete("/deleteCV/:id", cvCtrl.deleteCV);

// Route to generate and download the PDF resume
router.get("/generate-resume", auth, cvCtrl.generatePdf);

// Route to download the user's CV
router.get("/download-resume", auth, cvCtrl.downloadCv);
router.get("/downloadTHISresume/:id", auth, cvCtrl.downloadTHISCv);
// // Obtenir un CV par son ID
// router.get("/:id", cvCtrl.getCVById);
// router.get("/pop/:id", cvCtrl.getCVByIdPop);

module.exports = router;
