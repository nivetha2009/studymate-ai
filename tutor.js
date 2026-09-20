// routes/tutor.js
const express = require('express');
const { callClaude } = require('../utils/claudeClient');
const {
  buildTutorSystemPrompt, buildTutorUserMessage,
} = require('../prompts/tutorPrompt');
const {
  buildSimplifySystemPrompt, buildExamplePrompt, buildReExplainPrompt,
} = require('../prompts/simplifyPrompt');

const router = express.Router();

// POST /api/tutor  { question, materialContext? }
router.post('/', async (req, res, next) => {
  try {
    const { question, materialContext } = req.body;
    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'Please include a question.' });
    }
    const text = await callClaude(
      buildTutorSystemPrompt(),
      buildTutorUserMessage(question, materialContext)
    );
    res.json({ text });
  } catch (err) { next(err); }
});

// POST /api/tutor/simplify  { topic, previousExplanation }
router.post('/simplify', async (req, res, next) => {
  try {
    const { topic, previousExplanation } = req.body;
    const text = await callClaude(buildSimplifySystemPrompt(), `Topic: ${topic}\nPrevious explanation: ${previousExplanation || ''}`);
    res.json({ text });
  } catch (err) { next(err); }
});

// POST /api/tutor/example  { topic }
router.post('/example', async (req, res, next) => {
  try {
    const { topic } = req.body;
    const text = await callClaude(buildExamplePrompt(), `Topic: ${topic}`);
    res.json({ text });
  } catch (err) { next(err); }
});

// POST /api/tutor/explain-again  { topic }
router.post('/explain-again', async (req, res, next) => {
  try {
    const { topic } = req.body;
    const text = await callClaude(buildReExplainPrompt(), `Topic: ${topic}`);
    res.json({ text });
  } catch (err) { next(err); }
});

module.exports = router;
