const Notification = require("../models/notification");

exports.createnotification = async (req, res) => {
  try {
    const not = new Notification(req.body);
    await not.save();
    return res
      .status(201)
      .json({ message: "l'evenement a été créée avec succès." });
  } catch (err) {
    console.log(err);
  }
};

exports.getAllNotification = (req, res) => {
  Notification.find()
    .then((data) => {
      if (!data) {
        return res.status(404).json({ message: "No data found" });
      }
      res.status(200).json(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.getNotificationById = (req, res) => {
  const id = req.params.id;
  Notification.findById(id)
    .then((data) => {
      if (!data) {
        return res
          .status(404)
          .json({ message: "La notifiacation n'existe pas" });
      }
      res.status(200).json(data);
    })
    .catch((error) => {
      res.status(500).json({ error: error });
    });
};

exports.updateNotification = async (req, res) => {
  try {
    const id = req.params.id;
    await Notification.findByIdAndUpdate(id, req.body, { new: true });
    res.send(`l'evenement ${id} à été modifié avec succès `);
  } catch (err) {
    console.log("Error in update : " + err);
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const id = req.params.id;
    not = await Notification.findByIdAndDelete(id);
    if (not === null) {
      console.log(`Notification n'existe pas! `);
      return res.status(400).send("La notification n'a pas été trouvé");
    } else {
      res.status(200).json({ message: "La notification a été supprimée" });
    }
  } catch (err) {
    console.log(err);
  }
};
