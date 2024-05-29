const skillCtrl = require("../controllers/skill");
const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/add", auth, skillCtrl.addSkill);
router.get("/", auth, skillCtrl.getAllSkills);
router.patch("/:id", auth, skillCtrl.updateSkill);
router.delete("/:id", auth, skillCtrl.deleteSkill);

module.exports = router;
