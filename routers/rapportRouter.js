const express = require('express');
const router = express.Router();
const upload=require('../utils/upload')
const { uploadReport, downloadReport } = require('../controllers/rapportController');



// Route pour télécharger un rapport
router.post("/upload",upload.fields([{ name: 'rapport', maxCount: 1 }]),uploadReport);

// Route pour télécharger un rapport
router.get("/rapport/:reportId", downloadReport);

module.exports = router;


