// middleware/errorHandler.js
// -----------------------------------------------------------------------
// Centralised error handling. Technical details (stack traces, raw
// Claude/API errors, API keys) are logged server-side only — the
// student-facing message is always short, calm, and jargon-free.
// -----------------------------------------------------------------------

function notFound(req, res) {
  res.status(404).json({ error: "That page or endpoint doesn't exist." });
}

function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  console.error('[StudyMate AI] Error:', err.message);
  if (process.env.NODE_ENV !== 'production') console.error(err.stack);

  if (err.message?.startsWith('AI_RESPONSE_NOT_JSON') || err.message?.startsWith('AI_RESPONSE_MISSING_FIELDS')) {
    return res.status(502).json({
      error: 'Sorry, StudyMate AI is temporarily unavailable. Please try again.',
    });
  }

  if (err.status === 401 || err.status === 403) {
    return res.status(502).json({
      error: 'Sorry, StudyMate AI is temporarily unavailable. Please try again.',
    });
  }

  if (err.status === 429) {
    return res.status(429).json({
      error: "StudyMate AI is a little busy right now. Please try again in a moment.",
    });
  }

  res.status(500).json({ error: 'Something went wrong. Please try again.' });
}

module.exports = { notFound, errorHandler };
