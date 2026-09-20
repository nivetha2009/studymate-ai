// routes/quiz.js
const express = require('express');
const { callClaude } = require('../utils/claudeClient');
const { safeParseJson } = require('../utils/parseJson');
const { buildMcqSystemPrompt, buildMcqUserMessage } = require('../prompts/mcqPrompt');
const { buildHotsSystemPrompt, buildHotsUserMessage } = require('../prompts/hotsPrompt');

const router = express.Router();

function validateQuestions(data) {
  if (!Array.isArray(data)) throw new Error('AI_RESPONSE_MISSING_FIELDS: expected an array of questions');
  data.forEach((q) => {
    if (!q.q || !Array.isArray(q.options) || typeof q.correct !== 'number' || !q.explain) {
      throw new Error('AI_RESPONSE_MISSING_FIELDS: malformed question object');
    }
  });
  return data;
}

// POST /api/quiz  { subject, topic, difficulty, count, questionType, materialContext? }
router.post('/', async (req, res, next) => {
  try {
    const { subject, topic, difficulty, count, questionType, materialContext } = req.body;
    if (!subject || !topic || !count) {
      return res.status(400).json({ error: 'subject, topic and count are required.' });
    }

    const isHots = difficulty === 'HOTS';
    const raw = isHots
      ? await callClaude(buildHotsSystemPrompt(), buildHotsUserMessage({ subject, topic, count, materialContext }), { maxTokens: 2000 })
      : await callClaude(buildMcqSystemPrompt(), buildMcqUserMessage({ subject, topic, difficulty, count, questionType: questionType || 'MCQ', materialContext }), { maxTokens: 2000 });

    const questions = validateQuestions(safeParseJson(raw));
    res.json({ questions });
  } catch (err) { next(err); }
});

module.exports = router;
