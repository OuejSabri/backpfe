const express = require('express');
const router = express.Router();
const evenementCtrl = require('../controllers/evenement');

router.post('/creerEven', evenementCtrl.createEvn);
router.put('/updateEven/:id',  evenementCtrl.updateEven);
router.get('/allEven',  evenementCtrl.getAllEven);
router.get('/getEven/:id',  evenementCtrl.getEvenById);  
router.delete('/supprimerEven/:id',  evenementCtrl.deleteEven);


module.exports = router;