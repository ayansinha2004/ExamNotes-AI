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
const allowedOrigins = [
    "http://localhost:5173",
    "https://examnotesai-frontend.vercel.app"
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // Allow explicit origins or any vercel.app preview URL
        if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app')) {
            return callback(null, true);
        } else {
            return callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));

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