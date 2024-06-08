const express = require("express");
const router = express.Router();
const notificationCtrl = require("../controllers/notification");

router.post("/creerNotification", notificationCtrl.createnotification);
router.put("/updateNotification/:id", notificationCtrl.updateNotification);
router.get("/allNotification", notificationCtrl.getAllNotification);
router.get("/getNotification/:id", notificationCtrl.getNotificationById);
router.delete(
  "/supprimerNotification/:id",
  notificationCtrl.deleteNotification
);

module.exports = router;
