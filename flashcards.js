// routes/flashcards.js
const express = require('express');
const { callClaude } = require('../utils/claudeClient');
const { safeParseJson } = require('../utils/parseJson');
const { buildFlashcardSystemPrompt, buildFlashcardUserMessage } = require('../prompts/flashcardPrompt');

const router = express.Router();

// POST /api/flashcards  { topic, count, materialContext? }
router.post('/', async (req, res, next) => {
  try {
    const { topic, count, materialContext } = req.body;
    if (!topic) return res.status(400).json({ error: 'Please include a topic.' });

    const raw = await callClaude(
      buildFlashcardSystemPrompt(),
      buildFlashcardUserMessage({ topic, count: count || 10, materialContext }),
      { maxTokens: 1500 }
    );
    const cards = safeParseJson(raw);
    if (!Array.isArray(cards)) throw new Error('AI_RESPONSE_MISSING_FIELDS: expected an array of flashcards');
    res.json({ cards });
  } catch (err) { next(err); }
});

module.exports = router;
