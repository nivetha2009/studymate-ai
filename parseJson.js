// utils/parseJson.js
// -----------------------------------------------------------------------
// Claude is asked to return raw JSON for structured features (MCQs,
// flashcards, study plans, etc). Models occasionally wrap JSON in
// markdown fences or add stray whitespace — this helper strips that
// and throws a clear error if the result still isn't valid JSON, so
// route handlers can fall back to a friendly error response instead
// of crashing or showing garbage to the student.
// -----------------------------------------------------------------------

function safeParseJson(raw) {
  const cleaned = raw
    .trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    throw new Error('AI_RESPONSE_NOT_JSON: ' + err.message);
  }
}

/**
 * Validates that `data` has all `requiredKeys` (shallow check). Throws
 * a descriptive error on failure so the caller can return a clean
 * "Something went wrong" message instead of a half-populated UI.
 */
function assertShape(data, requiredKeys) {
  const missing = requiredKeys.filter((k) => !(k in data));
  if (missing.length) {
    throw new Error('AI_RESPONSE_MISSING_FIELDS: ' + missing.join(', '));
  }
  return data;
}

module.exports = { safeParseJson, assertShape };
