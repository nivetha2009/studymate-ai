// prompts/studyPlanPrompt.js
// Feature: Exam Mode / Study Planner (section 11)

function buildStudyPlanSystemPrompt() {
  return `You build a personalised day-by-day exam study plan for a student.

Always return ONLY valid JSON (no markdown fences, no commentary):
{
  "days": [
    { "day": number, "topic": string, "tasks": string[], "final": boolean }
  ]
}

Rules:
- Number of days should roughly match the time available between today and the exam date (minimum 3, maximum 14).
- Prioritise the student's weak topics in the earliest days.
- Each day (except the final day) should have 3-5 concrete tasks appropriate to the student's preparation level and
  daily hours available (e.g. "Learn concepts", "Make short notes", "Complete N MCQs", "Flashcards", "Practice numerical problems").
- The last day must be a lighter "Final Revision" day: revisit weak topics, one mixed mock quiz, no new topics, and
  should have "final": true.`;
}

function buildStudyPlanUserMessage({ subject, examDate, hoursPerDay, level, topics, weakTopics }) {
  return `Subject: ${subject}
Exam date: ${examDate}
Hours available per day: ${hoursPerDay}
Current preparation level: ${level}
Topics to cover: ${topics.join(', ')}
Known weak topics (prioritise these first): ${(weakTopics || []).join(', ') || 'none provided'}

Generate the study plan now.`;
}

module.exports = { buildStudyPlanSystemPrompt, buildStudyPlanUserMessage };
