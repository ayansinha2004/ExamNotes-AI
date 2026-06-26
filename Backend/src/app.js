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

// 1. CORS Configuration 
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"] 
}))

// 2. Stripe Webhook Route 
app.post('/api/payment/webhook',
    express.raw({ type: 'application/json' }), 
    paymentController.stripeHook
)

// 3. Global Body Parsers 
app.use(express.json())
app.use(cookieParser())

// 4. API Routes
app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)
app.use('/api/notes', notesRouter)
app.use('/api/pdf', pdfrouter)
app.use('/api/payment', creditRouter)

module.exports = app