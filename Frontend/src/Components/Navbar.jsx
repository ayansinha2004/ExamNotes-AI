import React, { useState } from 'react'
import { motion } from 'motion/react'
import { useDispatch, useSelector } from 'react-redux'
import { MdOutlineDiamond } from "react-icons/md"
import { FaPlusCircle } from "react-icons/fa"
import axios from 'axios'
import { serverUrl } from '../App'
import { setuserdata } from '../redux/userSlice'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const { userData } = useSelector((state) => state.user)

  const credits = userData?.user?.credits || 0
  const name = userData?.user?.name || ""

  const [showcredit, setShowcredit] = useState(false)
  const [profile, setProfile] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
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
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className='relative z-20 mx-6 mt-6 rounded-2xl bg-linear-to-br from-black/90 via-black/80 to-black/90 backdrop-blur-2xl border border-white/10 shadow-[0_20px_55px_rgba(0,0,0,0.75)] flex items-center justify-between px-8 py-4'
    >
      {/* Logo */}
      <div className='flex items-center gap-3'>
        <img src="logo.jpg" alt="logo" className='w-9 h-9' />
        <span className='text-lg font-semibold text-white'>
          ExamNotes <span className='text-gray-400'>AI</span>
        </span>
      </div>

      {/* Right Section */}
      <div className='flex items-center gap-6'>
        {/* Credits */}
        <span className='text-gray-200 p-2 bg-zinc-700 rounded-2xl backdrop-blur-2xl hover:scale-105 transition-all duration-150 flex items-center justify-center gap-2'>
          <MdOutlineDiamond size={15} />
          {credits}
          <FaPlusCircle
            size={20}
            className='cursor-pointer hover:scale-110 transition-all duration-150'
            onClick={(e) => {
              e.stopPropagation()
              setShowcredit(!showcredit)
              setProfile(false)
            }}
          />
        </span>

        {/* Profile Avatar */}
        <span
          onClick={() => {
            setProfile(!profile)
            setShowcredit(false)
          }}
          className='w-9 h-9 rounded-full bg-zinc-700 text-gray-200 flex items-center justify-center font-medium cursor-pointer hover:scale-105 transition-all duration-150'
        >
          {name?.charAt(0).toUpperCase()}
        </span>
      </div>

      {/* Credit Popup */}
      {showcredit && (
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className='absolute top-20 right-0 w-[90vw] max-w-75 rounded-2xl bg-linear-to-br from-black/90 via-black/80 to-black/90 backdrop-blur-2xl border border-white/10 shadow-[0_20px_55px_rgba(0,0,0,0.75)] flex flex-col items-center justify-between px-6 py-4 z-50'
        >
          <h3 className='text-white font-semibold mb-2'>
            Credits
          </h3>

          <p className='text-gray-400 text-sm text-center'>
            You currently have {credits} credits.
          </p>

          <button className='w-full mt-4 rounded-2xl bg-white text-black px-3 py-2 hover:scale-105 transition-all duration-150 font-medium' onClick={() => navigate('/pricing')}>
            Buy More Credits
          </button>
        </motion.div>
      )}

      {/* Profile Popup */}
      {profile && (
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className='absolute top-20 right-0 w-[90vw] max-w-75 rounded-2xl bg-linear-to-br from-black/90 via-black/80 to-black/90 backdrop-blur-2xl border border-white/10 shadow-[0_20px_55px_rgba(0,0,0,0.75)] flex flex-col gap-3 px-6 py-4 z-50'
        >
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 rounded-full bg-zinc-700 text-gray-200 flex items-center justify-center font-medium'>
              {name?.charAt(0).toUpperCase()}
            </div>

            <div>
              <p className='text-white font-medium'>{name}</p>
              <p className='text-gray-400 text-sm'>
                {credits} Credits
              </p>
            </div>
          </div>

          <button className='w-full py-2 rounded-xl bg-zinc-800 text-white hover:bg-zinc-700 transition-all'
            onClick={() => navigate('/history')}>
            History
          </button>

          <button className='w-full py-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all cursor-pointer' onClick={logout}>
            Logout
          </button>
        </motion.div>
      )}
    </motion.div>
  )
}

export default Navbar