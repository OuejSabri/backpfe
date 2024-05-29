const Attestation = require('../models/attestation');
const path = require('path');

const fs = require('fs'); 

exports.createAttestation = async (req, res, next) => {
  try {
    if (!req.files?.attestation[0]) {
      return res.status(400).json({ error: 'Aucun fichier trouvé' });
    }
    const cName = `${Date.now().toLocaleString()}-${req.files?.attestation[0]?.originalname}`
    const exist = fs.existsSync('./uploads')
    if (!exist) fs.mkdirSync('./uploads', { recursive: true })
    fs.writeFileSync(`uploads/${cName}`, req.files.attestation[0].buffer)
    let path = `${process.env.SERVERPATH}/uploads/${cName}`;
    
    const newAttestation = await Attestation.create({
      fileName: req.files?.attestation[0]?.originalname,
      filePath: path,
      candidature:req.body.candidature
    });

    res.status(201).json({ message: 'Attestation générée avec succès', data: newAttestation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la création de l'attestation" });
  }
};

exports.getAttestation = async (req, res, next) => {
  try {
    const attestation = await Attestation.findOne({candidature:req.params.id});
   return res.status(200).json({ message:'Attestation trouvée' ,data:attestation})
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la récupération de l'attestation" });
  }
};
