const express = require("express");
const router = express.Router();

const userCtrl = require("../controllers/user");
const validate = require("../middleware/validate-inputs");
const auth = require("../middleware/auth");

// Middleware pour s'incrire
router.post("/register", userCtrl.signup, validate.user);

// Verification
router.post("/verify", userCtrl.verifyUser);

// Request Reset Password
router.post("/request-reset-password", userCtrl.forgetPassword);

// Verification reset code
router.post("/verify-resetCode", userCtrl.verifyResetCode);

// Middleware pour se connecter
router.post("/login", userCtrl.login, validate.user);
// router.post( '/logout', userCtrl.logOut) ;
router.post("/forgotPassword", userCtrl.forgetPassword);
router.put("/resetPassword", userCtrl.resetPassword);
router.put("/modifierPassword/:id", userCtrl.modifierPassword);

router.get("/getOne", auth, userCtrl.getOne);
router.route("/getAll").get(userCtrl.getAllUsers);
router.route("/getAllSocietes").get(userCtrl.getAllSocietes);
router.route("/getAllStagiaires").get(userCtrl.getAllStagiaires);
router.route("/update/:id").put(userCtrl.updateUser);
router.route("/:id").delete(userCtrl.deleteUser);

module.exports = router;
