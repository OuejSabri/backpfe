const mongoose = require('mongoose');
const Evenement = require('../models/Evenement');

exports.createEvn = async (req, res) => {
    try{
        const even = new Evenement(req.body);
        await even.save();
        return  res.status(201).json({message: "l'evenement a été créée avec succès."});
    }catch(err){
        console.log(err);
    }
};


exports.getAllEven = (req, res) => {
    Evenement.find()
        .then(data => {
            if (!data) {
                return res.status(404).json({ message: "No data found" });
            }
            res.status(200).json(data);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};

exports.getEvenById = (req, res) => {
    const id = req.params.id;
    Evenement.findById(id)
        .then((data) => {
            if (!data) {
                return res.status(404).json({ message: "L'événement n'existe pas" });
            }
            res.status(200).json(data);
        }).catch((error) => {
            res.status(500).json({ error: error });
        });
};

exports.updateEven =async (req, res) => {
    try{
        const id = req.params.id;
        const nom = Evenement.nom;
        await Evenement.findByIdAndUpdate(id, req.body, {new: true} );
        res.send("l'evenement ${nom} à été modifié avec succès ");
    }catch(err){
        console.log("Error in update : "+err);
    }
};

exports.deleteEven = async (req, res) => {
    try{
        const id = req.params.id;
        even = await Evenement.findByIdAndDelete(id);
        if(even === null){
            console.log('evenement not found!');
            return  res.status(400).send("L'evenement n'a pas été trouvé");
        }else{
        res.status(200).json({message:"L'evenement a été supprimée"});}
    }catch(err){
        console.log(err);
    }
};