const experienceCtrl = require("../controllers/experience");
const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/add", auth, experienceCtrl.addExperience);
router.get("/", auth, experienceCtrl.getAllExperiences);
router.patch("/:id", auth, experienceCtrl.updateExperience);
router.delete("/:id", auth, experienceCtrl.deleteExperience);

module.exports = router;
