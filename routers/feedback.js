const express = require("express");
const router = express.Router();
const FeedbackCtrl = require("../controllers/feedback");

router.post("/creerFeedback", FeedbackCtrl.createFeedback);
router.put("/updateFeedback/:id", FeedbackCtrl.updateFeedback);
router.get("/allFeedback", FeedbackCtrl.getAllFeedback);
router.get("/getFeedback/:id", FeedbackCtrl.getFeedbackById);
router.delete("/supprimerFeedback/:id", FeedbackCtrl.deleteFeedback);

module.exports = router;
