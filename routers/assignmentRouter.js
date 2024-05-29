const express = require("express");
const router = express.Router();
const assignmentController = require("../controllers/assignmentController");
const multer = require('multer');
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage, fileFilter: (req, file, cb) => {
    cb(null, true)
  }
})

router.post(
  "/createAssignment",
  upload.fields([{ name: 'assignement', maxCount: 1 }]),
  assignmentController.createAssignment
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
