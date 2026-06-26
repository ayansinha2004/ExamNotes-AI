import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios' // Fixed: Added missing axios import
import { serverUrl } from '../App'

const Pricing = () => {
  const navigate = useNavigate()
  const [selectedPrice, setSelectedPrice] = useState(null)
  const [paying, setPaying] = useState(false)
  const [payingAmount, setPayingAmount] = useState(null)

  const handlePaying = async (amount) => {
    try {
      setPayingAmount(amount)
      setPaying(true)

      const result = await axios.post(
        serverUrl + '/api/payment/order',
        { amount },
        { withCredentials: true }
      )

      if (result.data.url) {
        window.location.href = result.data.url
      }

      setPaying(false)
    } catch (error) {
      console.error(error)
      setPaying(false)
    }
  }

  return (
    <div className='min-h-screen bg-gray-100 px-6 py-10 relative'>
      <button
        className='flex items-center gap-2 text-gray-600 hover:text-black mb-6 font-medium transition-colors'
        onClick={() => navigate('/')}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        Back
      </button>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className='text-center mb-10'>
        <h1 className='text-4xl font-bold text-gray-900'>Buy Credits</h1>
        <p className='text-gray-600 mt-2'>Choose a study plan that fits your study needs</p>
      </motion.div>

      <div className='max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-start'>
        <PricingCard
          title="Starter"
          price="₹100"
          amount={100}
          credits="50 Credits"
          description="Perfect for quick revisions"
          features={[
            "Generate AI notes",
            "Exam-focused answers",
            "Diagram & charts support",
            "Fast generation"
          ]}
          selectedPrice={selectedPrice}
          setSelectedPrice={setSelectedPrice}
          onBuy={handlePaying}
          paying={paying}
          payingAmount={payingAmount}
        />

        <PricingCard
          popular
          title="Popular"
          price="₹200"
          amount={200}
          credits="120 Credits"
          description="Best value for students"
          features={[
            "All Starter features",
            "More credits per ₹",
            "Revision mode access",
            "Priority AI response"
          ]}
          selectedPrice={selectedPrice}
          setSelectedPrice={setSelectedPrice}
          onBuy={handlePaying}
          paying={paying}
          payingAmount={payingAmount}
        />

        <PricingCard
          title="Pro Learner"
          price="₹500"
          amount={500}
          credits="300 Credits"
          description="For serious exam preparation"
          features={[
            "Maximum credit value",
            "Unlimited revisions",
            "Charts & diagrams",
            "Ideal for full syllabus"
          ]}
          selectedPrice={selectedPrice}
          setSelectedPrice={setSelectedPrice}
          onBuy={handlePaying}
          paying={paying}
          payingAmount={payingAmount}
        />
      </div>
    </div>
  )
}

function PricingCard({
  title,
  price,
  amount,
  credits,
  description,
  features,
  popular,
  selectedPrice,
  setSelectedPrice,
  onBuy,
  paying,
  payingAmount
}) {
  const isSelected = selectedPrice === amount;
  const isPayingThisCard = paying && payingAmount === amount;

  return (
    <motion.div
      onClick={() => setSelectedPrice(amount)}
      whileHover={{ y: -4 }}
      className={`
        relative cursor-pointer rounded-2xl p-6 bg-white transition-all duration-200 border-2
        ${isSelected ? "border-black shadow-md" : popular ? "border-indigo-500 shadow-sm" : "border-gray-200 hover:border-gray-300"}
      `}
    >
      {popular && !isSelected &&
        <span className='absolute top-4 right-4 text-xs font-semibold px-2 py-1 rounded bg-indigo-600 text-white'>Popular</span>
      }

      {isSelected &&
        <span className='absolute top-4 right-4 text-xs font-semibold px-2 py-1 rounded bg-black text-white'>Selected</span>
      }

      <h2 className='text-xl font-semibold text-gray-900'>{title}</h2>
      <p className='text-sm text-gray-500 mt-1'>{description}</p>

      <div className='mt-4'>
        <p className='text-3xl font-bold text-gray-900'>{price}</p>
        <p className='text-sm font-semibold text-indigo-600'>{credits}</p>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation()
          onBuy(amount)
        }}
        disabled={paying}
        className={`w-full mt-5 py-2.5 rounded-lg font-medium transition-colors ${isPayingThisCard
            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
            : isSelected
              ? "bg-black text-white hover:bg-gray-800"
              : popular
                ? "bg-blue-950 text-white"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
      >
        {isPayingThisCard ? "Redirecting...." : "Buy now"}
      </button>

      <ul className='mt-6 space-y-3 text-sm text-gray-600'>
        {features.map((f, i) => (
          <li key={i} className='flex items-start gap-2.5'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-green-600 mt-0.5 shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
            <span>{f}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  )
}

export default Pricing