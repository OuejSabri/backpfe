const Attestation = require("../models/attestation");
const Candidature = require("../models/condidature");
const path = require("path");
const fs = require("fs");
require("dotenv").config();
const PDFDocument = require("pdfkit");

exports.createAttestation = async (req, res) => {
  try {
    if (!req.files?.attestation[0]) {
      return res.status(400).json({ error: "Aucun fichier trouvé" });
    }
    const cName = `${Date.now().toLocaleString()}-${
      req.files?.attestation[0]?.originalname
    }`;
    const exist = fs.existsSync("./uploads");
    if (!exist) fs.mkdirSync("./uploads", { recursive: true });
    fs.writeFileSync(`uploads/${cName}`, req.files.attestation[0].buffer);
    let path = `${process.env.SERVERPATH}/uploads/${cName}`;

    const newAttestation = await Attestation.create({
      fileName: req.files?.attestation[0]?.originalname,
      filePath: path,
      candidature: req.body.candidature,
    });

    res.status(201).json({
      message: "Attestation générée avec succès",
      data: newAttestation,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Erreur lors de la création de l'attestation" });
  }
};
exports.generateAttestation = async (req, res) => {
  try {
    const  {id}  = req.params;
    const candidature = await Candidature.findOne({ _id: id }).populate([
      {
        path: "stagiaire",
        model: "user",
      },
      {
        path: "offreStage",
        model: "offre",
        populate: "societe",
      },
    ]);
    if (!candidature) {
      return res.status(404).json({ message: "candidature not found" });
    }
    const doc = new PDFDocument({ margin: 30 });
    const outputFileName = `${id}_attestation.pdf`;
    const outputPath = path.join(__dirname, `../uploads/${outputFileName}`);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);
    doc
      .fontSize(30)
      .fillColor("#4A90E2")
      .text("Attestation de stage", { underline: true });
    doc.moveDown();
    doc
      .fontSize(14)
      .fillColor("#000000")
      .text(
        `Nous soussignés,  ${
          candidature?.offreStage?.societe?.nom || ""
        } attestons que M. ${
          candidature?.stagiaire?.nom || ""
        } a effectué un stage dans notre societe. Pendant la periode allant du ${
          candidature?.date_debut || ""
        } au ${candidature?.date_fin || ""} . `
      );
    doc.text(
      `En foi de quoi, la présente attestation lui est délivrée pour servir et valoir ce que de droit .`
    );
    doc.text(`LE DIRECTEUR GENERAL `);
    doc.moveDown().moveDown();
    doc.end();

    stream.on("finish", async () => {
      const attestationUrl = `${process.env.BASE_URL}uploads/${outputFileName}`;
      await Candidature.findByIdAndUpdate(id, { attestation: attestationUrl });
      res.status(200).json({
        status: "success",
        message: "attestation generated successfully",
        data: {
          attestationUrl,
        },
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

exports.downloadAttestation = async (req, res) => {
  try {
    const { id } = req.params;
    const candidature = await Candidature.findOne({_id : id});
    if (!candidature) {
      return res.status(404).json({ message: "candidature not found" });
    }
    const attestationUrl = candidature?.attestation;
    const attestationFileName = path.basename(attestationUrl);

    // Construct the absolute path to the attestation file
    const attestationPath = path.join(
      __dirname,
      "../uploads",
      attestationFileName
    );

    console.log("Resolved attestation path:", attestationPath);

    // Ensure the attestation file exists
    if (!fs.existsSync(attestationPath)) {
      return res
        .status(404)
        .json({ status: "fail", message: "attestation file does not exist" });
    }

    // Set the appropriate headers to prompt download
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + attestationFileName
    );
    res.setHeader("Content-Type", "application/pdf");

    // Send the attestation file for download
    res.sendFile(attestationPath, (err) => {
      if (err) {
        console.error(err);
        res
          .status(500)
          .json({
            status: "error",
            message: "Error downloading the attestation",
          });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};

exports.getAttestation = async (req, res) => {
  try {
    const { id } = req.params;
    const candidature = await Candidature.findOne({ _id: id });

    return res
      .status(200)
      .json({ message: "candidature trouvée", data: candidature.attestation });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération de l'candidature" });
  }
};
