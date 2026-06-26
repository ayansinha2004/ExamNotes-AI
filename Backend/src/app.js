const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const authRouter = require('./routes/auth.route')
const userRouter = require('./routes/user.route')
const notesRouter = require('./routes/generate.route')
const pdfrouter = require('./routes/pdf.route')
const creditRouter = require('./routes/payment.route')
const paymentController = require('./controllers/payment.controller')

const app = express()
app.use(express.json())

app.post('/api/payment/webhook',
    express.raw({ typr: 'application.json' }),
    paymentController.stripeHook
)
app.use(cors(
    {
        origin: "http://localhost:5173",
        credentials: true,
        method: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    }
))
app.use(cookieParser())


app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)
app.use('/api/notes', notesRouter)
app.use('/api/pdf', pdfrouter)
app.use('/api/payment', creditRouter)

module.exports = app