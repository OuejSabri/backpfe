const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  try {
    // Configurer le transporteur SMTP
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: 'ouejsabri@gmail.com', // Adresse e-mail de l'expéditeur
        pass: "arkb tsug qvqi ayrk", // Mot de passe de l'expéditeur
      },
    });

    // Définir les options de l'e-mail
    const mailOptions = {
      from: "ouejsabri@gmail.com",
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html,
    };

    // Envoyer l'e-mail
    const info = await transporter.sendMail(mailOptions);
    console.log("E-mail envoyé:", info.messageId);
    return true; // Retourner vrai si l'e-mail est envoyé avec succès
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'e-mail:", error);
    return false; // Retourner faux en cas d'erreur
  }
};

module.exports = sendEmail;
