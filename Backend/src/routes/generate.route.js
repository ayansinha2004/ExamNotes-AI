const express = require('express')
const isAuth = require('../middleware/auth.middleware')
const generateNotes = require('../controllers/generate.controller')
const { getmyNotes, getSingleNotes } = require('../controllers/notes.controller')


const notesRouter = express.Router()

notesRouter.post('/generate-notes', isAuth, generateNotes)
notesRouter.get('/getnotes', isAuth, getmyNotes)
notesRouter.get('/getnotes/:id', isAuth, getSingleNotes)


module.exports = notesRouter

