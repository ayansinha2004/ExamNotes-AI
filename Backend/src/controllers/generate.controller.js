const notesModel = require("../models/notes.model");
const userModel = require("../models/user.model");
const generateGeminiResponse = require("../services/gemeni.services");
const buildPrompt = require("../utils/promptBuilder");

const generateNotes = async (req, res) => {
  try {
    const {
      topic,
      classLevel,
      examType,
      revisionmode = false,
      includeDiagram = false,
      showchartsarts = false,
    } = req.body;

    if (!topic) {
      return res.status(400).json({ message: "Topic is required" });
    }

    const user = await userModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.credits < 10) {
      if (user.isCreditAvailable !== false) {
        user.isCreditAvailable = false;
        await user.save();
      }
      return res.status(400).json({ message: "Insufficient credits" });
    }

    const prompt = buildPrompt({
      topic,
      classLevel,
      examType,
      revisionmode,
      includeDiagram,
      showchartsarts,
    });

    if (!prompt) {
      return res.status(400).json({ message: "Failed to generate prompt" });
    }

    const aiResponse = await generateGeminiResponse(prompt);
    console.log("Raw AI Response Captured");

    let parsedResponse;
    try {
      const cleanedResponse = aiResponse
        .replace(/^```json\s*/i, "")
        .replace(/\s*```$/, "")
        .trim();
      parsedResponse = JSON.parse(cleanedResponse);
    } catch (parseError) {
      try {
        const desperateClean = aiResponse.substring(aiResponse.indexOf("{"), aiResponse.lastIndexOf("}") + 1);
        parsedResponse = JSON.parse(desperateClean);
      } catch (secondaryError) {
        return res.status(500).json({
          success: false,
          message: "AI returned structurally invalid JSON output syntax",
          rawResponse: aiResponse,
        });
      }
    }
    
    const { notes, revisionPoints, questions, diagram, charts, subTopics } = parsedResponse;

    const safeSubTopics = subTopics || {
      "High": [topic],
      "Medium": ["Core Theoretical Foundations"],
      "Low": ["Practical Domain Applications"]
    };

    // Normalize diagram shape to guarantee it always contains a string under .data
    const normalizedDiagram = typeof diagram === "string" ? { data: diagram } : (diagram?.data ? diagram : { data: diagram?.code || "" });

    // FIXED: Now saving subTopics and normalized diagram inside the DB content block!
    const savedNotes = await notesModel.create({
      user: user._id,
      topic,
      classlevel: classLevel,     
      examType,
      revisionMode: revisionmode, 
      includeDiagram,
      includeChart: showchartsarts, 
      content: {
        notes: notes || parsedResponse.content?.notes || "",
        revisionPoints: revisionPoints || [],
        questions: questions || {},
        diagram: normalizedDiagram,
        charts: charts || [],
        subTopics: safeSubTopics // Preserving it to the DB cluster!
      }
    });

    user.credits -= 10;
    user.isCreditAvailable = user.credits >= 10;

    if (!Array.isArray(user.notes)) {
      user.notes = [];
    }
    user.notes.push(savedNotes._id);
    await user.save();

    return res.status(200).json({
      success: true,
      noteId: savedNotes._id,
      creditsLeft: user.credits,
      data: {
        _id: savedNotes._id,
        user: savedNotes.user,
        topic: savedNotes.topic,
        classLevel: classLevel,
        examType: savedNotes.examType,
        revisionmode: revisionmode,
        includeDiagram: savedNotes.includeDiagram,
        showchartsarts: showchartsarts,
        notes: savedNotes.content.notes,
        revisionPoints: savedNotes.content.revisionPoints,
        questions: savedNotes.content.questions,
        diagram: savedNotes.content.diagram,
        charts: savedNotes.content.charts,
        subTopics: savedNotes.content.subTopics,
        createdAt: savedNotes.createdAt
      }
    });

  } catch (err) {
    console.error("Generate Notes Error:", err);
    return res.status(500).json({
      success: false,
      error: "AI generation failed",
      message: err.message,
    });
  }
};

module.exports = generateNotes;