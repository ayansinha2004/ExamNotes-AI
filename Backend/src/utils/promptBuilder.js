const buildPrompt = ({
  topic,
  classLevel,
  examType,
  revisionmode,
  includeDiagram,
  showchartsarts,
}) => {
  return `
You are a STRICT JSON generator for an exam preparation system.

⚠️ VERY IMPORTANT:

* Output MUST be valid JSON
* Your response will be parsed using JSON.parse()
* INVALID JSON will cause system failure
* Use ONLY double quotes "
* No comments
* NO trailing commas
* Escape line breaks using \n
* Do NOT use emojis inside text values

TASK:
Convert the given topic into exam-focused notes.

INPUT:
Topic: ${topic}
Class Level: ${classLevel || "Not specified"}
Exam Type: ${examType || "General"}
Revision Mode: ${revisionmode ? "ON" : "OFF"}
Include Diagram: ${includeDiagram ? "YES" : "NO"}
Include Charts: ${showchartsarts ? "YES" : "NO"}

GLOBAL CONTENT RULES:

* Use clear, simple, exam-oriented language
* Notes MUST be Markdown formatted
* Headings and bullet points only
* Focus on concepts frequently asked in exams
* Avoid unnecessary theory
* Keep content highly structured

REVISION MODE RULES (CRITICAL):

IF REVISION MODE IS ON:

* Notes must be VERY SHORT
* Only bullet points
* One-line answers only
* Definitions, formulas, keywords
* No paragraphs
* No explanations
* Content must feel like:

  * Last-day revision
  * 5-minute exam cheat sheet
* revisionPoints MUST summarize ALL important facts

IF REVISION MODE IS OFF:

* Notes must be DETAILED but exam-focused
* Each topic should include:

  * Definition
  * Explanation
  * Key concepts
  * Examples (if applicable)
* Paragraph length: max 2-4 lines
* No storytelling
* No extra theory

IMPORTANCE RULES:

* Divide sub-topics into THREE categories:

  ⭐ = Very Important Topics

  ⭐⭐ = Important Topics

  ⭐⭐⭐ = Frequently Asked Topics

* All three categories MUST be present

* Base importance on exam frequency and weightage

QUESTION RULES:

* questions.short MUST be an array of strings
* questions.long MUST be an array of strings
* questions.diagram MUST be an array of strings
* Never return a single string for any question category
* Generate at least:

  * 3 short questions
  * 2 long questions
  * 2 diagram questions (when applicable)

DIAGRAM RULES:

IF INCLUDE DIAGRAM IS YES:

* diagram.data MUST be a SINGLE STRING
* Valid Mermaid syntax only
* Must start with: graph TD
* Wrap EVERY node label in square brackets []
* Do NOT use special characters inside labels

IF INCLUDE DIAGRAM IS NO:

* diagram.data MUST be ""

CHART RULES (RECHARTS):

IF INCLUDE CHARTS IS YES:

* charts array MUST NOT be empty
* Generate at least ONE chart
* Choose chart based on topic type:

  * THEORY topic → bar or pie
  * PROCESS topic → bar or line
* Use numerical values ONLY
* Labels must be short and exam-oriented

IF INCLUDE CHARTS IS NO:

* charts MUST be []

CHART TYPES ALLOWED:

* bar
* line
* pie

CHART OBJECT FORMAT:

{
"type": "bar | line | pie",
"title": "string",
"data": [
{
"name": "string",
"value": 10
}
]
}

STRICT JSON FORMAT (DO NOT CHANGE):

{
"subTopics": {
"⭐": [],
"⭐⭐": [],
"⭐⭐⭐": []
},

"importance": "⭐ | ⭐⭐ | ⭐⭐⭐",

"notes": "string",

"revisionPoints": [],

"questions": {
"short": [],
"long": [],
"diagram": []
},

"diagram": {
"type": "flowchart | graph | process",
"data": ""
},

"charts": []
}

RETURN ONLY VALID JSON.
`;
};

module.exports = buildPrompt;
