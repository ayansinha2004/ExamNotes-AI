import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const PaymentFailed = () => {
    const navigate = useNavigate()

    return (
        <div className='min-h-screen bg-gray-100 flex items-center justify-center px-6 py-10 relative'>
            {/* Top Left Back Button */}
            <button
                className='absolute top-10 left-6 flex items-center gap-2 text-gray-600 hover:text-black font-medium transition-colors'
                onClick={() => navigate('/pricing')} // Redirect back to pricing to try again
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
                Back to Pricing
            </button>

            {/* Main Container Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className='max-w-md w-full bg-white rounded-2xl p-8 border-2 border-gray-200 shadow-md text-center'
            >
                {/* Animated Error/Warning Circle */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                    className='w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-200'
                >
                    {/* Warning/Exclamation Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-9 h-9 text-red-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z" />
                    </svg>
                </motion.div>

                {/* Text Header */}
                <h1 className='text-3xl font-bold text-gray-900'>Transaction Failed</h1>
                <p className='text-gray-600 mt-2 text-sm'>
                    We couldn't process your payment. Don't worry—if any money was deducted, it will be refunded automatically.
                </p>

                <hr className='my-6 border-gray-100' />

                {/* Common Reasons Checklist */}
                <div className='bg-gray-50 border border-gray-200 rounded-xl p-4 text-left mb-6'>
                    <p className='text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2.5'>Common reasons for failure:</p>
                    <ul className='space-y-2 text-xs text-gray-600'>
                        <li className='flex gap-2 items-center'>
                            <span className='w-1.5 h-1.5 bg-red-500 rounded-full shrink-0' />
                            Insufficient account balance or credit limit
                        </li>
                        <li className='flex gap-2 items-center'>
                            <span className='w-1.5 h-1.5 bg-red-500 rounded-full shrink-0' />
                            Incorrect card details, CVV, or OTP entered
                        </li>
                        <li className='flex gap-2 items-center'>
                            <span className='w-1.5 h-1.5 bg-red-500 rounded-full shrink-0' />
                            International or online transactions are disabled on your card
                        </li>
                    </ul>
                </div>

                {/* Call to Actions */}
                <div className='space-y-3'>
                    <button
                        onClick={() => navigate('/pricing')}
                        className='w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors'
                    >
                        Try Another Payment Method
                    </button>

                    <button
                        onClick={() => navigate('/')}
                        className='w-full bg-white text-gray-700 border border-gray-300 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors'
                    >
                        Return to Dashboard
                    </button>
                </div>
            </motion.div>
        </div>
    )
}

export default PaymentFailed