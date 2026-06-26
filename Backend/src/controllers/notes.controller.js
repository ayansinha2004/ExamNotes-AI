const notesModel = require('../models/notes.model');

const getmyNotes = async (req, res) => {
  try {
    const notesDocs = await notesModel.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .lean();

    const flattenedNotes = notesDocs.map((doc) => {
      const contentBlock = doc.content || {};
      
      const finalNotes = doc.notes || contentBlock.notes || "";
      const finalRevisionPoints = doc.revisionPoints || contentBlock.revisionPoints || [];
      const finalQuestions = doc.questions || contentBlock.questions || {};
      const finalCharts = doc.charts || contentBlock.charts || [];

      // FIXED: Safely unpack diagram string properties
      let finalDiagram = doc.diagram || contentBlock.diagram || { data: "" };
      if (typeof finalDiagram === "string") {
        finalDiagram = { data: finalDiagram };
      }

      // FIXED: Look for subTopics inside the contentBlock first, then fallback
      const safeSubTopics = contentBlock.subTopics || doc.subTopics || {
        "High": [doc.topic],
        "Medium": ["Core Theoretical Foundations"],
        "Low": ["Practical Domain Applications"]
      };

      return {
        _id: doc._id,
        user: doc.user,
        topic: doc.topic,
        classLevel: doc.classlevel || doc.classLevel,     
        examType: doc.examType,
        revisionmode: doc.revisionMode || doc.revisionmode, 
        includeDiagram: doc.includeDiagram,
        showchartsarts: doc.includeChart || doc.showchartsarts, 
        notes: finalNotes,
        revisionPoints: finalRevisionPoints,
        questions: finalQuestions,
        diagram: finalDiagram,
        charts: finalCharts,
        subTopics: safeSubTopics, 
        createdAt: doc.createdAt
      };
    });

    return res.status(200).json(flattenedNotes);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

const getSingleNotes = async (req, res) => {
  try {
    const notesDoc = await notesModel.findOne({
      _id: req.params.id,
      user: req.userId
    }).lean();

    if (!notesDoc) {
      return res.status(404).json({ error: "Note not found" });
    }

    const contentBlock = notesDoc.content || {};
    
    const finalNotes = notesDoc.notes || contentBlock.notes || "";
    const finalRevisionPoints = notesDoc.revisionPoints || contentBlock.revisionPoints || [];
    const finalQuestions = notesDoc.questions || contentBlock.questions || {};
    const finalCharts = notesDoc.charts || contentBlock.charts || [];

    let finalDiagram = notesDoc.diagram || contentBlock.diagram || { data: "" };
    if (typeof finalDiagram === "string") {
      finalDiagram = { data: finalDiagram };
    }

    const safeSubTopics = contentBlock.subTopics || notesDoc.subTopics || {
      "High": [notesDoc.topic],
      "Medium": ["Core Theoretical Foundations"],
      "Low": ["Practical Domain Applications"]
    };

    return res.status(200).json({
      _id: notesDoc._id,
      user: notesDoc.user,
      topic: notesDoc.topic,
      classLevel: notesDoc.classlevel || notesDoc.classLevel,
      examType: notesDoc.examType,
      revisionmode: notesDoc.revisionMode || notesDoc.revisionmode,
      includeDiagram: notesDoc.includeDiagram,
      showchartsarts: notesDoc.includeChart || notesDoc.showchartsarts, 
      notes: finalNotes,
      revisionPoints: finalRevisionPoints,
      questions: finalQuestions,
      diagram: finalDiagram,
      charts: finalCharts,
      subTopics: safeSubTopics,
      createdAt: notesDoc.createdAt
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

module.exports = { getmyNotes, getSingleNotes };