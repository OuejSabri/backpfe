const educationCtrl = require("../controllers/education");
const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/add", auth, educationCtrl.addEducation);
router.get("/", auth, educationCtrl.getAllEducations);
router.patch("/:id", auth, educationCtrl.updateEducation);
router.delete("/:id", auth, educationCtrl.deleteEducation);

module.exports = router;
