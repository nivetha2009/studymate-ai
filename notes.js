// routes/notes.js
const express = require('express');
const { callClaude } = require('../utils/claudeClient');
const { safeParseJson, assertShape } = require('../utils/parseJson');
const { buildNotesSystemPrompt, buildNotesUserMessage } = require('../prompts/notesPrompt');

const router = express.Router();

// POST /api/notes  { topic, materialContext? }
router.post('/', async (req, res, next) => {
  try {
    const { topic, materialContext } = req.body;
    if (!topic) return res.status(400).json({ error: 'Please include a topic.' });

    const raw = await callClaude(buildNotesSystemPrompt(), buildNotesUserMessage(topic, materialContext), { maxTokens: 1200 });
    const notes = assertShape(safeParseJson(raw), ['topic', 'explanation', 'points', 'definitions', 'examples', 'tips', 'revision']);
    res.json(notes);
  } catch (err) { next(err); }
});

module.exports = router;
