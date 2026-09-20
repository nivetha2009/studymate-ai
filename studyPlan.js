// routes/studyPlan.js
const express = require('express');
const { callClaude } = require('../utils/claudeClient');
const { safeParseJson, assertShape } = require('../utils/parseJson');
const { buildStudyPlanSystemPrompt, buildStudyPlanUserMessage } = require('../prompts/studyPlanPrompt');

const router = express.Router();

// POST /api/study-plan  { subject, examDate, hoursPerDay, level, topics, weakTopics }
router.post('/', async (req, res, next) => {
  try {
    const { subject, examDate, hoursPerDay, level, topics, weakTopics } = req.body;
    if (!subject || !examDate || !Array.isArray(topics) || topics.length === 0) {
      return res.status(400).json({ error: 'subject, examDate and at least one topic are required.' });
    }

    const raw = await callClaude(
      buildStudyPlanSystemPrompt(),
      buildStudyPlanUserMessage({ subject, examDate, hoursPerDay, level, topics, weakTopics }),
      { maxTokens: 2000 }
    );
    const plan = assertShape(safeParseJson(raw), ['days']);
    res.json(plan);
  } catch (err) { next(err); }
});

module.exports = router;
