const mongoose = require('mongoose')

const notesSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserModel",
        required: true
    },
    topic: {
        type: String,
        required: true
    },
    classlevel: String,
    examType: String,

    revisionMode: {
        type: Boolean,
        default: false
    },
    includeDiagram: Boolean,
    includeChart: Boolean,

    content: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    }
}
    , {
        timestamps: true
    })

const notesModel = mongoose.model('notes', notesSchema)

module.exports = notesModel