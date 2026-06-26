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
      return res.status(400).json({
        message: "Topic is required",
      });
    }

    // req.userId must be populated by your auth middleware
    const user = await userModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.credits < 10) {
      user.isCreditAvailable = false;
      await user.save();

      return res.status(400).json({
        message: "Insufficient credits",
      });
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
      return res.status(400).json({
        message: "Failed to generate prompt",
      });
    }

    const aiResponse = await generateGeminiResponse(prompt);

    console.log("Raw AI Response:");
    console.log(aiResponse);

    let parsedResponse;

    try {
      const cleanedResponse = aiResponse
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      parsedResponse = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);

      return res.status(500).json({
        success: false,
        message: "AI returned invalid JSON",
        rawResponse: aiResponse,
      });
    }
    const { notes, revisionPoints, questions, diagram, charts } = parsedResponse;

    const savedNotes = await notesModel.create({
      user: user._id,
      topic,
      classLevel,
      examType,
      revisionmode,
      includeDiagram,
      showchartsarts,
      // Mapping fields directly to match your document shape
      notes: notes || parsedResponse.content?.notes || "",
      revisionPoints: revisionPoints || [],
      questions: questions || {},
      diagram: diagram || {},
      charts: charts || []
    });

    // Credit Deductions
    user.credits -= 10;
    if (user.credits <= 0) {
      user.isCreditAvailable = false;
    }

    if (!Array.isArray(user.notes)) {
      user.notes = [];
    }

    user.notes.push(savedNotes._id);
    await user.save();

    // Return the created database document data to the frontend
    return res.status(200).json({
      success: true,
      data: savedNotes,
      noteId: savedNotes._id,
      creditsLeft: user.credits,
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