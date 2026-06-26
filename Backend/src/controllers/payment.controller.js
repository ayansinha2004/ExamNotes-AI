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

        if (!CREDIT_MAP[amount]) {
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
                            name: `${CREDIT_MAP[amount]} Credits`
                        },
                        unit_amount: amount * 100
                    },
                    quantity: 1
                }
            ],
            metadata: {
                userId: userId.toString(),
                credits: CREDIT_MAP[amount].toString()
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
    try {
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object
            const userId = session.metadata.userId
            const creditToAdd = Number(session.metadata.credits)

            if (!userId || !creditToAdd) {
                return res.status(400).json({ message: "Invalid metadata" })
            }

            await userModel.findByIdAndUpdate(userId, {
                $inc: { credits: creditToAdd },
                $set: { isCreditAvailable: true }
            }, { new: true })

            console.log(`Successfully credited ${creditToAdd} to user ${userId}`)
        }
        return res.status(200).json({ received: true })

    } catch (error) {
        console.error("Database updating error in hook:", error)
        return res.status(500).json({ message: "Internal server handling error" })
    }
}

module.exports = { createCreditsOrder, stripeHook };