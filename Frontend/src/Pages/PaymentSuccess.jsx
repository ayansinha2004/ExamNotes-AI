import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const PaymentSuccess = () => {
    const navigate = useNavigate()
    const [countdown, setCountdown] = useState(5)

    // Automatic redirection countdown logic
    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer)
                    navigate('/') // Redirects home/dashboard when timer ends
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [navigate])

    return (
        <div className='min-h-screen bg-gray-100 flex items-center justify-center px-6 py-10 relative'>
            {/* Top Left Back Button to match Pricing layout */}
            <button
                className='absolute top-10 left-6 flex items-center gap-2 text-gray-600 hover:text-black font-medium transition-colors'
                onClick={() => navigate('/')}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
                Back to Home
            </button>

            {/* Main Container Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className='max-w-md w-full bg-white rounded-2xl p-8 border-2 border-gray-200 shadow-md text-center'
            >
                {/* Animated Checkmark Circle */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                    className='w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-200'
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-10 h-10 text-green-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                </motion.div>

                {/* Text Header */}
                <h1 className='text-3xl font-bold text-gray-900'>Payment Successful!</h1>
                <p className='text-gray-600 mt-2 text-sm'>
                    Your transaction went through perfectly. Your credits have been added to your profile.
                </p>

                <hr className='my-6 border-gray-100' />

                {/* Notice Section */}
                <div className='bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-left mb-6'>
                    <div className='flex gap-3 items-start'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                        </svg>
                        <div>
                            <p className='text-sm font-semibold text-indigo-950'>Ready to Study?</p>
                            <p className='text-xs text-indigo-700 mt-0.5'>You can now return to generating AI summaries, notes, and full syllabus exams immediately.</p>
                        </div>
                    </div>
                </div>

                {/* Call to Actions */}
                <div className='space-y-3'>
                    <button
                        onClick={() => navigate('/')}
                        className='w-full bg-black text-white py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors'
                    >
                        Go to Dashboard
                    </button>

                    <p className='text-xs text-gray-400'>
                        Redirecting automatically in <span className='font-semibold text-gray-600'>{countdown}s</span>...
                    </p>
                </div>
            </motion.div>
        </div>
    )
}

export default PaymentSuccess