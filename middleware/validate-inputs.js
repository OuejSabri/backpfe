const Joi = require('joi');

const userSchema = Joi.object({
    nom: Joi.string().trim().required(),
    email: Joi.string().trim().email().required(),
    telephone: Joi.string().trim().required(),
    role: Joi.string().trim().required(),
    password: Joi.string().trim().min(4).max(30).required(),
    rep_password: Joi.string().trim().valid(Joi.ref("password")),
});
exports.user = (req, res, next) => {
    console.log(req)
    const { error, value } = userSchema.validate(req.body);
    if(error) {
        res.status(422).json({ error: 'donnée invalide !' });
    } else {
        next();
    }
};

const offreSchema = Joi.object({
    titre : Joi.string().trim().required(),
    description : Joi.string().trim().required(),
    date_debut : Joi.date().required(),
    date_fin : Joi.date().required(),
    number_candidats : Joi.number()
});
exports.offre = (req,res,next) => {
    const { error, value } = offreSchema.validate(req.body);
    if(error){
        res.status(423).json({ error: 'donnéee invalide !' });
    } else {
        next();
    }
};