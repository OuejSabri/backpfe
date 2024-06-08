const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(401).json({ message: "Requête non authentifiée !" });
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the user from the database using the decoded token's userId
    const user = await User.findById(decodedToken.id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé !" });
    }

    // Attach the user object to the request
    req.user = user;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Le token a expiré !" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Token invalide !" });
    } else {
      return res.status(401).json({ message: "Requête non authentifiée !" });
    }
  }
};
