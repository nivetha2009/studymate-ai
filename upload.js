// middleware/upload.js
// -----------------------------------------------------------------------
// Handles "My Materials" file uploads (PDF, PPT, PPTX, DOC, DOCX, TXT).
// Files are stored on disk under /uploads; in production, swap
// diskStorage for an object-storage (S3, GCS) upload instead.
//
// NOTE: extracting text from PDFs/PPTs/DOCs is intentionally left as a
// clearly marked hook below — plug in a library such as `pdf-parse`
// (PDF), `mammoth` (DOCX), or `officeparser` (PPT/PPTX) depending on
// the file type, then pass the extracted text into the AI Tutor / Notes
// / MCQ prompts as the "material context".
// -----------------------------------------------------------------------
const multer = require('multer');
const path = require('path');

const ALLOWED_EXTENSIONS = ['.pdf', '.ppt', '.pptx', '.doc', '.docx', '.txt'];

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return cb(new Error('UNSUPPORTED_FILE_TYPE'));
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB
});

// TODO (CONNECT REAL EXTRACTION): given req.file.path, extract plain text
// and return it so routes/materials.js can store it alongside the
// material's metadata for later use as AI context.
async function extractText(filePath, mimeType) {
  // Placeholder — wire up pdf-parse / mammoth / officeparser here.
  return '';
}

module.exports = { upload, extractText, ALLOWED_EXTENSIONS };
