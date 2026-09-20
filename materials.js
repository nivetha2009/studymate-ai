// routes/materials.js
const express = require('express');
const { upload, extractText } = require('../middleware/upload');

const router = express.Router();

// In-memory demo store. Replace with a real database (e.g. Postgres/Mongo)
// keyed by authenticated student id in production.
const materialsStore = [];

// GET /api/materials
router.get('/', (req, res) => {
  res.json({ materials: materialsStore });
});

// POST /api/materials/upload  (multipart/form-data, field name "file")
router.post('/upload', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "We couldn't upload this file. Please check the file type and try again." });
    }
    const text = await extractText(req.file.path, req.file.mimetype); // CONNECT REAL EXTRACTION (see middleware/upload.js)
    const material = {
      id: 'm' + Date.now(),
      name: req.file.originalname,
      type: req.file.originalname.split('.').pop().toLowerCase(),
      path: req.file.path,
      textPreview: text.slice(0, 500),
      uploadedAt: new Date().toISOString(),
    };
    materialsStore.unshift(material);
    res.json({ material });
  } catch (err) { next(err); }
});

module.exports = router;
