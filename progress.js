// routes/progress.js
const express = require('express');
const { callClaude } = require('../utils/claudeClient');
const { safeParseJson, assertShape } = require('../utils/parseJson');
const { buildWeakTopicSystemPrompt, buildWeakTopicUserMessage } = require('../prompts/weakTopicAnalysisPrompt');

const router = express.Router();

// POST /api/progress/analyze  { quizHistory, topicScores, streak, ... }
// Body should be the student's real, stored activity data — never fabricated.
router.post('/analyze', async (req, res, next) => {
  try {
    const activityData = req.body;
    if (!activityData || Object.keys(activityData).length === 0) {
      return res.status(400).json({ error: 'Please include the student activity data to analyze.' });
    }

    const raw = await callClaude(
      buildWeakTopicSystemPrompt(),
      buildWeakTopicUserMessage(activityData),
      { maxTokens: 800 }
    );
    const analysis = assertShape(safeParseJson(raw), ['weakTopics', 'strongTopics', 'recommendations']);
    res.json(analysis);
  } catch (err) { next(err); }
});

module.exports = router;
