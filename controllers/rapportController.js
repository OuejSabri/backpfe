const path = require('path');
const fs = require('fs');
const Report = require('../models/rapport');

require('dotenv').config()

const uploadReport = async (req, res) => {
  try {
    
    if (!req.files?.rapport[0]) {
      return res.status(400).json({ error: 'Aucun fichier trouvé' });
    }
    const cName = `${Date.now().toLocaleString()}-${req.files?.rapport[0]?.originalname}`
    const exist = fs.existsSync('./uploads')
    if (!exist) fs.mkdirSync('./uploads', { recursive: true })
    fs.writeFileSync(`uploads/${cName}`, req.files.rapport[0].buffer)
    let path = `${process.env.SERVERPATH}/uploads/${cName}`;
    const newReport = new Report({
      fileName: req.files?.rapport[0]?.originalname,
      filePath: path,
      candidature:req.body.candidature
    });

    await newReport.save();

    return res.status(201).json({ message: 'Rapport téléchargé avec succès',data:newReport});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erreur lors du téléchargement du rapport' });
  }
};

const downloadReport = async (req, res) => {
  try {
    const report = await Report.findOne({candidature:req.params.reportId});

    // if (!report) {
    //   return res.status(404).json({ error: 'Rapport non trouvé' });
    // }

    // const reportPath = path.join(__dirname, report.filePath);
    // const fileStream = fs.createReadStream(reportPath);

    // res.setHeader('Content-Type', 'application/pdf');
    // res.setHeader('Content-Disposition', `attachment; filename=${report.fileName}`);

    // fileStream.pipe(res);
    return res.status(200).json({ message: 'Rapport téléchargé avec succès' ,data:report});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erreur lors du téléchargement du rapport' });
  }
};

module.exports = { uploadReport, downloadReport };


