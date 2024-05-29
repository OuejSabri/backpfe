require("dotenv").config();
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const Profil = require("../models/profil");
const Education = require("../models/education");
const Experience = require("../models/experience");
const Projet = require("../models/projet");
const Skill = require("../models/skill");
const Task = require("../models/tache");
const User = require("../models/user");

exports.createCv = async (req, res) => {
  try {
    const cv = await CV.create(req.body);
    res.status(201).json({ status: "success", data: cv });
  } catch (error) {
    res
      .status(400)
      .jso({ status: "fail", message: "error lors de la creation de cv" });
  }
};

exports.getAllCvs = async (req, res) => {
  try {
    const cvs = await CV.find();
    res.status(200).json({ status: "success", data: cvs });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      status: "fail",
      message: "error lors de la recuperation des cvs",
    });
  }
};

// Obtenir un CV par son ID
exports.getCVByIdPop = async (req, res, next) => {
  try {
    const id = req.params.id;
    const cv = await CV.findById(id).populate([
      {
        path: "education",
        model: "Education",
      },
      {
        path: "experience",
        model: "Experience",
      },
      {
        path: "project",
        model: "Projet",
      },
      {
        path: "skill",
        model: "Skill",
      },
      {
        path: "certification",
        model: "Certification",
      },
    ]);
    if (!cv) {
      return res.status(404).json({
        status: "fail",
        message: "Aucun CV trouvé avec cet ID",
      });
    }
    res.status(200).json({
      status: "success",
      data: cv,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Erreur lors de la récupération du CV",
    });
  }
};
exports.getCVById = async (req, res, next) => {
  try {
    const cv = await CV.findById(req.params.id);
    if (!cv) {
      return res.status(404).json({
        status: "fail",
        message: "Aucun CV trouvé avec cet ID",
      });
    }
    res.status(200).json({
      status: "success",
      data: cv,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Erreur lors de la récupération du CV",
    });
  }
};

// Mettre à jour un CV
exports.updateCV = async (req, res, next) => {
  try {
    const updatedCV = await CV.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedCV) {
      return res.status(404).json({
        status: "fail",
        message: "Aucun CV trouvé avec cet ID",
      });
    }
    res.status(200).json({
      status: "success",
      data: updatedCV,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Erreur lors de la mise à jour du CV",
    });
  }
};

// Supprimer un CV
exports.deleteCV = async (req, res, next) => {
  try {
    const deletedCV = await CV.findByIdAndDelete(req.params.id);
    if (!deletedCV) {
      return res.status(404).json({
        status: "fail",
        message: "Aucun CV trouvé avec cet ID",
      });
    }
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Erreur lors de la suppression du CV",
    });
  }
};

exports.generatePdf = async (req, res) => {
  try {
    const userId = req.user._id; // Get the user ID from the token

    // Fetch all the user data
    const profil = await Profil.findOne({ user: userId }).populate("user");
    if (!profil) {
      return res
        .status(404)
        .json({ status: "fail", message: "Profile not found" });
    }

    const educations = await Education.find({ user: userId });
    const experiences = await Experience.find({ user: userId });
    const projets = await Projet.find({ user: userId });
    const skills = await Skill.find({ user: userId });
    const tasks = await Task.find({ user: userId });

    // Create a new PDF document
    const doc = new PDFDocument({ margin: 30 });

    // Define the output path
    const outputFileName = `${userId}_resume.pdf`;
    const outputPath = path.join(__dirname, `../resumes/${outputFileName}`);

    // Ensure the directory exists
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });

    // Write the document to a file
    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    // Add the profile data to the PDF
    doc.fontSize(24).fillColor("#4A90E2").text("Profile", { underline: true });
    doc.moveDown();
    doc
      .fontSize(14)
      .fillColor("#000000")
      .text(`Name: ${profil.user.nom || ""}`);
    doc.text(`Email: ${profil.user.email || ""}`);
    doc.text(`Phone: ${profil.user.telephone || ""}`);
    doc.text(`Address: ${profil.adresse || ""}`);
    doc.text(`City: ${profil.ville || ""}`);
    doc.text(`Domain: ${profil.domaine || ""}`);
    doc.text(`Description: ${profil.description || ""}`);
    doc.moveDown().moveDown();

    // Add the education data to the PDF
    doc
      .fontSize(24)
      .fillColor("#4A90E2")
      .text("Education", { underline: true });
    doc.moveDown();
    educations.forEach((edu) => {
      doc
        .fontSize(14)
        .fillColor("#000000")
        .text(`Institution: ${edu.institut}`);
      doc.text(`Field of Study: ${edu.domaineEtude}`);
      doc.text(`Start Date: ${edu.dateDebut.toDateString()}`);
      doc.text(`End Date: ${edu.dateFin.toDateString()}`);
      doc.moveDown().moveDown();
    });

    // Add the experience data to the PDF
    doc
      .fontSize(24)
      .fillColor("#4A90E2")
      .text("Experience", { underline: true });
    doc.moveDown();
    experiences.forEach((exp) => {
      doc.fontSize(14).fillColor("#000000").text(`Company: ${exp.entreprise}`);
      doc.text(`Position: ${exp.poste}`);
      doc.text(`Start Date: ${exp.dateDebut.toDateString()}`);
      doc.text(
        `End Date: ${exp.dateFin ? exp.dateFin.toDateString() : "Present"}`
      );
      doc.text(`Description: ${exp.description || ""}`);
      doc.moveDown().moveDown();
    });

    // Add the project data to the PDF
    doc.fontSize(24).fillColor("#4A90E2").text("Projects", { underline: true });
    doc.moveDown();
    projets.forEach((projet) => {
      doc.fontSize(14).fillColor("#000000").text(`Title: ${projet.titre}`);
      doc.text(`Description: ${projet.description}`);
      doc.text(`Date: ${projet.date.toDateString()}`);
      doc.moveDown().moveDown();
    });

    // Add the skills data to the PDF
    doc.fontSize(24).fillColor("#4A90E2").text("Skills", { underline: true });
    doc.moveDown();
    skills.forEach((skill) => {
      doc.fontSize(14).fillColor("#000000").text(`Skill: ${skill.nom}`);
      doc.text(`Level: ${skill.niveau}`);
      doc.moveDown().moveDown();
    });

    // Add the tasks data to the PDF
    doc.fontSize(24).fillColor("#4A90E2").text("Tasks", { underline: true });
    doc.moveDown();
    tasks.forEach((task) => {
      doc.fontSize(14).fillColor("#000000").text(`Title: ${task.title}`);
      doc.text(`Description: ${task.description}`);
      doc.text(`Status: ${task.status}`);
      doc.text(`Date: ${task.date.toDateString()}`);
      doc.moveDown().moveDown();
    });

    // Finalize the PDF and end the stream
    doc.end();

    // Wait for the stream to finish
    stream.on("finish", async () => {
      // Create the URL for the resume
      const resumeUrl = `${process.env.BASE_URL}resumes/${outputFileName}`;

      // Save the resume URL to the user's profile
      await User.findByIdAndUpdate(userId, { resume: resumeUrl });

      // Send the response with the resume URL
      res.status(200).json({
        status: "success",
        message: "Resume generated successfully",
        data: {
          resumeUrl,
        },
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};

exports.downloadCv = async (req, res) => {
  try {
    const userId = req.user._id; // Get the user ID from the token

    // Fetch the user data
    const user = await User.findById(userId);
    if (!user || !user.resume) {
      return res.status(404).json({ status: "fail", message: "CV not found" });
    }

    // Extract the file name from the URL
    const resumeUrl = user.resume;
    const resumeFileName = path.basename(resumeUrl);

    // Construct the absolute path to the resume file
    const resumePath = path.join(__dirname, "../resumes", resumeFileName);

    console.log("Resolved resume path:", resumePath);

    // Ensure the resume file exists
    if (!fs.existsSync(resumePath)) {
      return res
        .status(404)
        .json({ status: "fail", message: "CV file does not exist" });
    }

    // Set the appropriate headers to prompt download
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + resumeFileName
    );
    res.setHeader("Content-Type", "application/pdf");

    // Send the resume file for download
    res.sendFile(resumePath, (err) => {
      if (err) {
        console.error(err);
        res
          .status(500)
          .json({ status: "error", message: "Error downloading the CV" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};
