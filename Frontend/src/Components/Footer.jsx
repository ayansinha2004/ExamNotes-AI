import React from 'react'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { serverUrl } from '../App'
import { setuserdata } from '../redux/userSlice'
import { FcCopyright } from "react-icons/fc";


const Footer = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const logout = async () => {
    try {
      await axios.get(serverUrl + '/api/auth/logout', { withCredentials: true })
      dispatch(setuserdata(null))
      navigate('/auth')
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className='z-10 mx-6 mb-6 mt-24 rounded-2xl bg-linear-to-br from-black/90 via-black/80 to-black/90 backdrop-blur-2xl border border-white/10 px-8 py-8 shadow-[0_25px_60px_rgba(0,0,0,0.7)]'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-8 items-start'>
        <motion.div
          whileHover={{ rotateX: 6, rotateY: -6 }}
          className="flex flex-col gap-4 transform-gpu"
          style={{ transformStyle: "preserve-3d" }}>
          <div className='flex items-center gap-3 cursor-pointer'
            style={{ transform: "translateZ(20px)" }}>
            <img src="logo.jpg" alt="" className='h-8 w-8' />
            <span className='text-lg font-semibold bg-linear-to-br from-white via-gray-300 to-white bg-clip-text text-transparent'
              style={{ textShadow: "0 6px 18px rgba(0,0,0,0.4)" }}>
              ExamNotes <span className='text-gray-400'>AI</span>
            </span>
          </div>
          <p className='text-sm text-gray-300 max-w-sm'>ExamNotes AI helps students generate exam-focused notes,revision material,diagrams and prontable PDFs using AI</p>
        </motion.div>
        <div className='text-center'>
          <ul className='space-y-2 text-sm'>
            <li className='text-gray-300 hover:text-white transition-colors font-bold'>Quick Links</li>
            <li className='text-gray-300 hover:text-white transition-colors cursor-pointer' onClick={() => navigate('/notes')}>Notes</li>
            <li className='text-gray-300 hover:text-white transition-colors cursor-pointer' onClick={() => navigate('/history')}>History</li>
            <li className='text-gray-300 hover:text-white transition-colors cursor-pointer' onClick={() => navigate('/pricing')}>Add credits</li>
          </ul>
        </div>
        <div className='text-center'>
          <ul className='space-y-2 text-sm'>
            <li className='text-gray-300 hover:text-white transition-colors font-bold'>Suppport & Account</li>
            <li className='text-gray-300 hover:text-white transition-colors cursor-pointer' onClick={() => navigate('/auth')}>Sign In</li>
            <li className='text-white hover:text-red-600 transition-colors cursor-pointer' onClick={logout}>Log Out</li>
            <li className='text-white hover:text-red-600 transition-colors cursor-pointer'>Email:support@gmail.com</li>
          </ul>
        </div>
      </div>
      <div className=' mt-2 h-px bg-white/10'>
        <p className='text-center text-xs text-gray-500 flex items-center justify-center gap-1 pt-2'>
          <FcCopyright size={20} />{new Date().getFullYear()} ExamNotes AI. All rights reserved
        </p>
      </div>
    </motion.div>
  )
}

export default Footer