import React from 'react'
import { motion } from 'motion/react'

const AuthCard = ({ title, des, icon }) => {
  return (
    <motion.div
      whileHover={{ y: -12, rotateX: 8, rotateY: -8, scale: 1.05 }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
      className='relative rounded-2xl p-6
      bg-linear-to-br from-black/90 via-black/80 to-black/90
      backdrop-blur-2xl
      border border-white/10
      shadow-[0_30px_80px_rgba(0,0,0,0.7)]
      text-white overflow-hidden'
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Hover Glow */}
      <div
        className='absolute inset-0 rounded-2xl
        bg-linear-to-br from-white/10 to-transparent
        opacity-0 hover:opacity-100 transition-opacity duration-300
        pointer-events-none'
      />

      {/* Content */}
      <div
        className='relative z-10'
        style={{ transform: "translateZ(30px)" }}
      >
        {/* Render the icon wrapper if an icon is passed */}
        {icon && (
          <span className='text-2xl block mb-2 opacity-90 select-none'>
            {icon}
          </span>
        )}

        <h3 className='text-lg font-semibold mb-2'>
          {title}
        </h3>

        <p className='text-gray-300 text-sm leading-relaxed'>
          {des}
        </p>
      </div>
    </motion.div>
  )
}

export default AuthCard