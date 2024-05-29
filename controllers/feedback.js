const Feedback = require('../models/feedback');


exports.createFeedback = async (req, res) => {
    try{
        const feed = new Feedback(req.body);
        await feed.save();
        return  res.status(201).json({message: "le Feedback a été créée avec succès."});
    }catch(err){
        console.log(err);
    }
};


exports.getAllFeedback = async (req, res) => {
  try {
    const feeds = await Feedback.find();
    if (!feeds) {
      return res
        .status(404)
        .json({ status: "error", data: "Aucun Feedback n'a été trouvé." });
    }
    return res.status(200).json({ status: "success", data: feeds });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

exports.getFeedbackById = (req, res) => {
    const id = req.params.id;
    Feedback.findById(id)
        .then((data) => {
            if (!data) {
                return res.status(404).json({ message: "La Feedback n'existe pas" });
            }
            res.status(200).json(data);
        }).catch((error) => {
            res.status(500).json({ error: error });
        });
};

exports.updateFeedback =async (req, res) => {
    try{
        const id = req.params.id;
        await Feedback.findByIdAndUpdate(id, req.body, {new: true} );
        res.send(`le Feedback ${id} à été modifié avec succès `);
    }catch(err){
        console.log("Error in update : "+err);
    }
};

exports.deleteFeedback = async (req, res) => {
    try{
        const id = req.params.id;
        feed = await Feedback.findByIdAndDelete(id);
        if(feed === null){
            console.log(`Feedback n'existe pas! `);
            return  res.status(400).send("Le Feedback n'a pas été trouvé");
        }else{
        res.status(200).json({message:"Le Feedback a été supprimée"});}
    }catch(err){
        console.log(err);
    }
};