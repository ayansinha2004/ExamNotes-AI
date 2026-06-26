import React from 'react'
import { motion } from 'motion/react'
import { FcGoogle } from "react-icons/fc";
import AuthCard from '../Components/AuthCard';
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/firebase";
import { serverUrl } from '../App';
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setuserdata } from '../redux/userSlice'

const Auth = () => {
  const cards = [
    {
      title: "Exam Notes",
      des: "Generate exam-ready notes instantly with AI-powered summaries and structured content.",
      icon: <span className="text-xl block mb-2">📖</span>
    },
    {
      title: "Project Reports",
      des: "Create professional project reports with proper formatting and clean layouts.",
      icon: <span className="text-xl block mb-2">💼</span>
    },
    {
      title: "Charts & Graphs",
      des: "Visualize complex concepts and data using AI-generated charts and diagrams.",
      icon: <span className="text-xl block mb-2">📊</span>
    },
    {
      title: "PDF Export",
      des: "Download beautifully formatted PDFs ready for study, revision, or submission.",
      icon: <span className="text-xl block mb-2">💾</span>
    }
  ];

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handleGoogleAuth = async () => {
    try {
      const response = await signInWithPopup(auth, provider);
      const user = response.user;
      const result = await axios.post(
        serverUrl + '/api/auth/google',
        {
          name: user.displayName,
          email: user.email
        },
        {
          withCredentials: true
        }
      )
      dispatch(setuserdata(result.data))
      navigate('/')
    } catch (err) {
      console.log("ERROR:", err);
    }
  }
  return (
    <div className='min-h-screen overflow-hidden bg-white text-black px-6 lg:px-8'>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className='max-w-7xl mx-auto mt-8 rounded-2xl bg-linear-to-br from-black/90 via-black/80 to-black/90 backdrop-blur-2xl border border-white/10 px-8 py-6 shadow-[0_30px_80px_rgba(0,0,0,0.7)]'
      >
        <h1 className='text-xl font-bold bg-linear-to-br from-white via-gray-300 to-white bg-clip-text text-transparent'>
          ExamNotes AI
        </h1>

        <p className='mt-1 text-xs bg-linear-to-br from-gray-200 via-gray-400 to-gray-200 bg-clip-text text-transparent'>
          AI-Powered Exam Notes & Revision Platform
        </p>
      </motion.header>

      {/* Main Content */}
      <main className='max-w-5xl mx-auto py-12 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center'>

        {/* Left Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className='text-4xl lg:text-5xl font-extrabold leading-tight bg-linear-to-br from-black via-gray-700 to-black bg-clip-text text-transparent'>
            Unlock Smart <br />
            AI Notes
          </h1>

          <motion.button
            onClick={handleGoogleAuth}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className='mt-8 px-6 py-3 rounded-xl flex items-center gap-3 bg-linear-to-br from-black/90 via-black/80 to-black/90 backdrop-blur-2xl border border-white/10 text-white text-sm font-medium shadow-[0_30px_80px_rgba(0,0,0,0.7)] hover:border-white/20 transition-all duration-100'
          >
            <FcGoogle size={20} />
            Continue with Google
          </motion.button>

          <p className='mt-5 max-w-md text-base text-gray-700 leading-relaxed'>
            Generate exam notes, project reports, charts, graphs, and downloadable PDFs in seconds using the power of AI.
          </p>

          <p className='mt-3 max-w-md text-xs text-gray-500'>
            Start with <span className='font-semibold text-black'>50 FREE Credits</span>. Upgrade anytime for more generations and advanced features.
          </p>
        </motion.div>

        {/* Right Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className='grid grid-cols-1 sm:grid-cols-2 gap-5'
        >
          {cards.map((card, index) => (
            <AuthCard
              key={index}
              title={card.title}
              des={card.des}
              icon={card.icon}
            />
          ))}
        </motion.div>

      </main>
    </div>
  );
};

export default Auth;