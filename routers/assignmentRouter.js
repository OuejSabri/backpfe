const express = require("express");
const router = express.Router();
const assignmentController = require("../controllers/assignmentController");
const affectationCtrl = require ("../controllers/affectation");
const multer = require('multer');
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage, fileFilter: (req, file, cb) => {
    cb(null, true)
  }
})

router.post(
  "/createAssignment",
  upload.fields([{ name: "affectation", maxCount: 1 }]),
  affectationCtrl.createAffectation
);

router.get(
  "/getAssignment/:id",
  assignmentController.getAssignmentById
);

router.get(
  "/getAllAssignments",
  assignmentController.getAllAssignments
);

module.exports = router;
