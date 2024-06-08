const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const userRoutes = require("./routers/user");
const offreRoutes = require("./routers/offre");
const evenementRouter = require("./routers/evenement");
const notificationRouter = require("./routers/notification");
const feedbackRouter = require("./routers/feedback");
const cvRouter = require("./routers/cv");
const projetRouter = require("./routers/projet");
const educationRouter = require("./routers/education");
const experienceRouter = require("./routers/experience");
const certificationRouter = require("./routers/certification");
const skillRouter = require("./routers/skill");
const path = require("path");
const assignmentRouter = require("./routers/assignmentRouter");
const candidatureRouter = require("./routers/condidatureRouter");
const tacheRouter = require("./routers/tacheRouter");
const rapportRouter = require("./routers/rapportRouter");
const attestationRouter = require("./routers/attestationRouter");
const profilRouter = require('./routers/profil');
const affectationRouter = require("./routers/affectation");
const dotenv = require("dotenv");
dotenv.config();
// Connecting with mongo db
// Connecting MongoDB
mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });

  // Middleware to serve static files from the "resumes" directory
app.use('/resumes', express.static(path.join(__dirname, 'resumes')));

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors("*"));

app.use("/api/auth", userRoutes);
app.use("/api/offre", offreRoutes);
app.use("/api/profil", profilRouter);

app.use("/api/feedback", feedbackRouter);
app.use("/api/evenement", evenementRouter);
app.use("/api/notification", notificationRouter);

app.use("/api/cvs", cvRouter);
app.use("/api/projets", projetRouter);
app.use("/api/educations", educationRouter);
app.use("/api/experiences", experienceRouter);
app.use("/api/certifications", certificationRouter);
app.use("/api/skills", skillRouter);

app.use("/api/assignments", assignmentRouter);
app.use("/api/candidatures", candidatureRouter);
app.use("/api/taches", tacheRouter);
app.use("/api/rapports", rapportRouter);
app.use("/api/attestations", attestationRouter);
app.use("/api/affectations", affectationRouter)

// Create port
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log("Connected to port " + port);
});
