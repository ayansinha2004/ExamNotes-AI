const express = require('express');
const router = express.Router();
const { pdfDownload } = require('../controllers/pdf.controller');

router.post('/download-pdf', pdfDownload);

module.exports = router;
