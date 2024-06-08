const Candidature = require("../models/condidature");
const Affectation = require("../models/affectation")
const path = require("path");
const fs = require("fs");
require("dotenv").config();
const PDFDocument = require("pdfkit");

exports.createAffectation = async (req, res) => {
  try {
    if (!req.files?.affectation[0]) {
      return res.status(400).json({ error: "Aucun fichier trouvé" });
    }
    const cName = `${Date.now().toLocaleString()}-${
      req.files?.affectation[0]?.originalname
    }`;
    const exist = fs.existsSync("./uploads");
    if (!exist) fs.mkdirSync("./uploads", { recursive: true });
    fs.writeFileSync(`uploads/${cName}`, req.files.affectation[0].buffer);
    let path = `${process.env.SERVERPATH}/uploads/${cName}`;
    const newAffectation = await Affectation.create({
      fileName: req.files?.affectation[0]?.originalname,
      filePath: path,
      candidature: req.body.candidature,
    });
    return res.status(201).json({
      status: "success",

      data: newAffectation,
    });
  } catch (err) {
    return res.status(422).json({
      status: "err",

      data: err,
    });
  }
};

exports.generateAffectation = async (req, res) => {
  try {
    const { id } = req.params;
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
    const outputFileName = `${id}_affectation.pdf`;
    const outputPath = path.join(__dirname, `../uploads/${outputFileName}`);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);
    doc
      .fontSize(30)
      .fillColor("#4A90E2")
      .text("Affectation de stage", { underline: true });
    doc.moveDown();
    doc
      .fontSize(18)
      .fillColor("#000000")
      .text(`Etudiant (e): ${candidature?.stagiaire?.nom || ""}` , { underline: true });
    doc
      .fontSize(12)
      .fillColor("#000000")
      .text(
        `Suite à l'oofre de stage ${
          candidature?.offreStage?.titre || ""
        } que vous avez postuler, Je porte à votre connaissance que vous êtes affecté (e) à la société ${
          candidature?.offreStage?.societe?.nom || ""
        } pour effectuer un stage obligatoire du ${
          candidature?.date_debut || ""
        } au ${candidature?.date_fin || ""} . `
      );
    doc.text(
      ` A la fin de vos travaux et selon un délai, qui sera affiché, vous êtes tenu à déposer un rapport ne dépassant pas les 15 pages 
,incluant le journal de stage pour installer une copie de l’attestation de stage.`
    );
    doc.text(
      `Par ailleurs, je me tiens à votre entière disposition pour tout autre renseignement concernant les stages(${
        candidature?.offreStage?.societe?.email || ""
      }) `
    );
    doc.moveDown().moveDown();
    doc.end();

    stream.on("finish", async () => {
      const affectationUrl = `${process.env.BASE_URL}uploads/${outputFileName}`;
      await Candidature.findByIdAndUpdate(id, { affectation: affectationUrl });
      res.status(200).json({
        status: "success",
        message: "affectation generated successfully",
        data: {
          affectationUrl,
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

exports.downloadAffectation = async (req, res) => {
  try {
    const { id } = req.params;
    const candidature = await Candidature.findOne({ _id: id });
    if (!candidature) {
      return res.status(404).json({ message: "candidature not found" });
    }
    const affectationUrl = candidature?.affectation;
    const affectationFileName = path.basename(affectationUrl);

    // Construct the absolute path to the affectation file
    const affectationPath = path.join(
      __dirname,
      "../uploads",
      affectationFileName
    );

    console.log("Resolved affectation path:", affectationPath);

    // Ensure the affectation file exists
    if (!fs.existsSync(affectationPath)) {
      return res
        .status(404)
        .json({ status: "fail", message: "affectation file does not exist" });
    }

    // Set the appropriate headers to prompt download
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + affectationFileName
    );
    res.setHeader("Content-Type", "application/pdf");

    // Send the affectation file for download
    res.sendFile(affectationPath, (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({
          status: "error",
          message: "Error downloading the affectation",
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};
