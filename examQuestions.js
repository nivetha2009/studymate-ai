// routes/examQuestions.js
const express = require('express');
const { callClaude } = require('../utils/claudeClient');
const { safeParseJson, assertShape } = require('../utils/parseJson');
const { buildExamQuestionsSystemPrompt, buildExamQuestionsUserMessage } = require('../prompts/examQuestionsPrompt');

const router = express.Router();

// POST /api/exam-questions  { subject, topic, count?, materialContext? }
router.post('/', async (req, res, next) => {
  try {
    const { subject, topic, count, materialContext } = req.body;
    if (!subject || !topic) return res.status(400).json({ error: 'subject and topic are required.' });

    const raw = await callClaude(
      buildExamQuestionsSystemPrompt(),
      buildExamQuestionsUserMessage({ subject, topic, count, materialContext }),
      { maxTokens: 1800 }
    );
    const data = assertShape(safeParseJson(raw), ['questions']);
    res.json(data);
  } catch (err) { next(err); }
});

module.exports = router;
