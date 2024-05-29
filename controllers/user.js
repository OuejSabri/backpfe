const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/user");
const sendEmail = require("../utils/sendMail");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 465,
  secure: true,
  tls: {
    rejectUnauthorized: false,
  },
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.signup = async (req, res) => {
  try {
    const { nom, email, telephone, role, password } = req.body;

    // Valider le format de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Format d'email invalide" });
    }

    // Vérifier si la longueur du mot de passe est d'au moins 5 caractères
    if (password.length < 5) {
      return res.status(400).json({
        message: "Le mot de passe doit contenir au moins 5 caractères",
      });
    }

    const userEmail = await User.findOne({ email });
    if (userEmail) {
      return res.status(409).json({ message: "L'email existe déjà" });
    }

    // // Générer le code OTP
    // // const otpCode = Math.floor(1000 + Math.random() * 9000).toString(); // OTP à 4 chiffres
    // const otpExpiration = new Date(Date.now() + 20 * 60000); // 20 minutes à partir de maintenant

    // Hacher le mot de passe
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = new User({
      nom,
      email,
      telephone,
      role,
      password: hashedPassword,
    });

    await user.save({ validateBeforeSave: false });

    res
      .status(201)
      .json({ message: "Utilisateur créé avec succès !", data: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

exports.verifyUser = async (req, res) => {
  const { verificationCode } = req.body;

  try {
    // Essayer de trouver le code de vérification dans les collections User et Supplier
    const user = await User.findOne({ verificationCode });

    if (!user) {
      return res.status(400).json({ error: "Code de vérification invalide" });
    }

    const verificationCodeExpiration = user.verificationCodeExpiration;
    if (
      !verificationCodeExpiration ||
      Date.now() > verificationCodeExpiration.getTime()
    ) {
      return res
        .status(400)
        .json({ error: "Le code de vérification a expiré" });
    }

    // Mettre à jour l'utilisateur/fournisseur comme vérifié
    user.verified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpiration = undefined;
    await user.save();

    res.status(200).json({
      message: "Vérifié avec succès",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "L'utilisateur n'existe pas !" });
    }

    // Valider le mot de passe
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: "Mot de passe incorrect !" });
    }

    // Générer des tokens
    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Retourner la réponse
    return res
      .status(200)
      .json({ message: "Connecté avec succès", accessToken });
  } catch (err) {
    console.error("Erreur lors de la tentative de connexion :", err);
    return res.status(500).send({ error: "Erreur interne du serveur" });
  }
};

exports.forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Valider le format de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Format d'email invalide" });
    }

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    // Générer le code OTP
    const otpCode = Math.floor(1000 + Math.random() * 9000).toString(); // OTP à 4 chiffres
    const otpExpiration = new Date(Date.now() + 10 * 60000); // 20 minutes à partir de maintenant

    // Définir l'OTP et l'expiration sur l'objet utilisateur
    user.resetPasswordCode = otpCode;
    user.resetPasswordCodeExpiration = otpExpiration;

    // Sauvegarder l'utilisateur avec les nouveaux détails de l'OTP
    await user.save({ validateBeforeSave: false });

    // Envoyer l'email OTP
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Confirmation du code OTP",
      html: `<p>Votre code OTP pour réinitialiser le mot de passe est : <b>${otpCode}</b></p><p>Ce code expirera dans 10 minutes. Veuillez utiliser ce code pour réinitialiser votre mot de passe.</p>`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: `E-mail envoyé à ${user.email} avec succès`,
    });
  } catch (error) {
    console.error(
      "Erreur lors de la réinitialisation du mot de passe :",
      error
    );
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};
exports.verifyResetCode = async (req, res) => {
  try {
    const { email, otpCode } = req.body;
    console.log("Received email:", email);
    console.log("Received OTP code:", otpCode);

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Format d'email invalide" });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    console.log("Stored OTP code:", user.resetPasswordCode);
    console.log(
      "Stored OTP code expiration:",
      user.resetPasswordCodeExpiration
    );

    // Check if the OTP code matches
    if (user.resetPasswordCode !== otpCode) {
      return res.status(400).json({ error: "Code OTP invalide" });
    }

    // Check if the OTP code is expired
    const currentDate = new Date();
    const expirationDate = new Date(user.resetPasswordCodeExpiration);
    console.log("Current date:", currentDate);
    console.log("Expiration date:", expirationDate);

    if (expirationDate < currentDate) {
      return res.status(400).json({ error: "Code OTP expiré" });
    }

    user.resetPasswordCode = undefined;
    user.resetPasswordCodeExpiration = undefined;
    await user.save();

    // OTP verification successful
    return res.status(200).json({ message: "Code OTP vérifié avec succès" });
  } catch (error) {
    console.error("Erreur lors de la vérification du code OTP :", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword, confirmNewPassword } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        error: "Utilisateur non trouvé",
      });
    }

    // Check if the new password and confirm password match
    if (newPassword !== confirmNewPassword) {
      return res
        .status(400)
        .json({ error: "Les mots de passe ne correspondent pas" });
    }

    // Hash the new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update the user's password
    user.password = hashedPassword;

    // Save the updated user object
    await user.save();

    res.status(200).json({
      success: true,
      message: "Mot de passe réinitialisé avec succès",
    });
  } catch (error) {
    console.error(
      "Erreur lors de la réinitialisation du mot de passe :",
      error
    );
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

exports.modifierPassword = async (req, res) => {
  const userId = req.params.id;
  const user = await User.findOne({ _id: userId });
  if (!(await user.correctPassword(req.body.ancienMotDePasse, user.password))) {
    return res.status(400).json({ error: "Ancien mot de passe incorrect" });
  }
  if (user.correctPassword(req.body.nouveauMotDePasse, user.password)) {
    return res
      .status(400)
      .json({ error: "Nouveau mot de passe identique à l'ancien" });
  }
  if (req.body.nouveauMotDePasse !== req.body.repMotDePasse) {
    return res.statut(400).json({
      error:
        "Les mots de passe ne correspondent pas ! veuillez confirmer votre mot de passe !",
    });
  }
  const salt = 10;
  const genSalt = await bcrypt.genSalt(salt);
  const hashedPassword = await bcrypt.hash(req.body.nouveauMotDePasse, genSalt);
  user.password = hashedPassword;
  await user.save();
  return res.send({ msg: "Votre mot de passe est modifié" });
};

exports.getOne = async (req, res) => {
  try {
    const userId = req.user._id; // Get the user ID from the token

    if (!userId) {
      return res.status(400).json({
        status: "fail",
        message: "User ID is required",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    return res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    return res.status(200).json({
      status: "success",
      data: users,
    });
  } catch (err) {
    return res.status(500).send(err);
  }
};
exports.getAllStagiaires = async (req, res, next) => {
  try {
    const users = await User.find({ role: "stagiaire" });
    return res.status(200).json({
      status: "success",
      data: users,
    });
  } catch (err) {
    return res.status(500).send(err);
  }
};
exports.getAllSocietes = async (req, res, next) => {
  try {
    const users = await User.find({ role: "societe" });
    return res.status(200).json({
      status: "success",
      data: users,
    });
  } catch (err) {
    return res.status(500).send(err);
  }
};
exports.updateUser = async (req, res, next) => {
  const { userId } = req.params.id;
  const updates = req.body;

  const updatedUser = await User.findByIdAndUpdate(userId, updates, {
    new: true,
  });

  if (!updatedUser) {
    return res
      .status(404)
      .json({ status: "error", message: "Utilisateur non trouvé" });
  }

  return res.status(200).json({ status: "success", data: updatedUser });
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    res.send(`${id} supprimé avec succès `);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    console.log(err);
  }
};
