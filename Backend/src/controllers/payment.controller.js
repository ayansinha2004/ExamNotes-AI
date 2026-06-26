const userModel = require('../models/user.model')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const CREDIT_MAP = {
    100: 50,
    200: 120,
    500: 300
}

const createCreditsOrder = async (req, res) => {
    try {
        const userId = req.userId
        const { amount } = req.body

        // Convert key to number explicitly to protect lookup verification
        if (!CREDIT_MAP[Number(amount)]) {
            return res.status(400).json({ message: "Invalid credit plan" })
        }

        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_types: ['card'],
            success_url: `${process.env.CLIENT_URL}/payment-success`,
            cancel_url: `${process.env.CLIENT_URL}/payment-failed`,
            line_items: [
                {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: `${CREDIT_MAP[Number(amount)]} Credits`
                        },
                        unit_amount: Number(amount) * 100 // Stripe accepts amount in cents/paise
                    },
                    quantity: 1
                }
            ],
            metadata: {
                userId: userId.toString(),
                credits: CREDIT_MAP[Number(amount)].toString()
            }
        })

        return res.status(200).json({ url: session.url })
    } catch (error) {
        console.error("Checkout Session Error:", error)
        return res.status(500).json({ message: "Stripe error" })
    }
}

const stripeHook = async (req, res) => {
    const sign = req.headers['stripe-signature']
    let event
    
    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sign,
            process.env.STRIPE_WEBHOOK_KEY
        )
    } catch (error) {
        console.error("Webhook verification failed:", error.message)
        return res.status(400).send(`Webhook Error: ${error.message}`)
    }

    // Acknowledge receipt of the event to Stripe immediately
    res.status(200).json({ received: true })

    // Process event asynchronously so Stripe isn't left hanging during heavy DB loads
    try {
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object
            const userId = session.metadata.userId
            const creditToAdd = Number(session.metadata.credits)

            if (!userId || !creditToAdd) {
                console.error("Webhook processing halted: Invalid metadata context")
                return;
            }

            await userModel.findByIdAndUpdate(userId, {
                $inc: { credits: creditToAdd },
                $set: { isCreditAvailable: true }
            }, { new: true })

            console.log(`Successfully credited ${creditToAdd} to user ${userId}`)
        }
    } catch (error) {
        // Log locally for debugging—Stripe has already received its 200 acknowledgment
        console.error("Database updating error in hook downstream execution:", error)
    }
}

module.exports = { createCreditsOrder, stripeHook };