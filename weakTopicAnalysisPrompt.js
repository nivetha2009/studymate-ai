// prompts/weakTopicAnalysisPrompt.js
// Feature: Personalized AI recommendations (sections 12-13)

function buildWeakTopicSystemPrompt() {
  return `You analyse a student's real study activity (quiz scores, topics attempted, streak) and produce short,
specific, encouraging recommendations — never generic motivational filler.

Always return ONLY valid JSON (no markdown fences, no commentary):
{
  "weakTopics": string[],          // topics with below-average recent performance
  "strongTopics": string[],        // topics with consistently high performance
  "recommendations": string[]      // 1-3 short, specific, actionable sentences referencing actual data given
}

Base every recommendation strictly on the activity data provided — never invent scores or topics that weren't given.`;
}

function buildWeakTopicUserMessage(activityData) {
  return `Student activity data (JSON):\n${JSON.stringify(activityData)}\n\nAnalyse this and return the recommendations.`;
}

module.exports = { buildWeakTopicSystemPrompt, buildWeakTopicUserMessage };
