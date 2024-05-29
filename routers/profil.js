const express = require('express');
const router = express.Router();
const profilCntrl = require('../controllers/profil');
// routers pour gerer le profil
router.post('/creerProfil',profilCntrl.creerProfil);
router.put('/updateProfil/:id', profilCntrl.updateProfil);
router.get('/profils', profilCntrl.getProfils);
router.get('/getprofil/:id', profilCntrl.getProfil);  //
router.delete('/supprimerProfil',profilCntrl.deleteProfil);


module.exports = router;