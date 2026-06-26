const notesModel = require('../models/notes.model');

const getmyNotes = async (req, res) => {
    try {
        const notes = await notesModel.find({ user: req.userId })
            .select('topic createdAt examType content includeDiagram revisionMode')
            .sort({ createdAt: -1 });

        return res.status(200).json(notes);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const getSingleNotes = async (req, res) => {
    try {
        const notes = await notesModel.findOne({
            _id: req.params.id,
            user: req.userId
        });

        if (!notes) {
            return res.status(404).json({ error: "Note not found" });
        }


        return res.status(200).json({
            _id: notes._id,
            topic: notes.topic,
            notes: notes.notes || notes.content,
            subTopics: notes.subTopics,
            revisionPoints: notes.revisionPoints,
            questions: notes.questions,
            diagram: notes.diagram,
            charts: notes.charts,
            createdAt: notes.createdAt
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports = { getmyNotes, getSingleNotes };