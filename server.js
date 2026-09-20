// server.js
// -----------------------------------------------------------------------
// StudyMate AI backend/API layer.
//
//   Student → Frontend → Backend (this file) → Claude API → Backend → Frontend → Student
//
// The frontend never talks to Claude directly and never sees
// ANTHROPIC_API_KEY. It calls these routes; these routes call Claude.
// -----------------------------------------------------------------------
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const { notFound, errorHandler } = require('./middleware/errorHandler');

const tutorRoutes = require('./routes/tutor');
const notesRoutes = require('./routes/notes');
const quizRoutes = require('./routes/quiz');
const flashcardRoutes = require('./routes/flashcards');
const examQuestionRoutes = require('./routes/examQuestions');
const studyPlanRoutes = require('./routes/studyPlan');
const progressRoutes = require('./routes/progress');
const materialsRoutes = require('./routes/materials');

const app = express();
const PORT = process.env.PORT || 8787;

const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
app.use(cors({ origin: allowedOrigins.length ? allowedOrigins : true }));
app.use(express.json({ limit: '2mb' }));

// Basic abuse protection — tune per your traffic.
const limiter = rateLimit({ windowMs: 60 * 1000, max: 30 });
app.use('/api', limiter);

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use('/api/tutor', tutorRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/flashcards', flashcardRoutes);
app.use('/api/exam-questions', examQuestionRoutes);
app.use('/api/study-plan', studyPlanRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/materials', materialsRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`StudyMate AI backend listening on http://localhost:${PORT}`);
});
