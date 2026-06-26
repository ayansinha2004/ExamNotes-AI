import React, { useState } from "react";
import { motion } from "framer-motion"; // Note: correct package path if motion/react was a typo, otherwise keep yours
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { MdOutlineDiamond } from "react-icons/md";
import { FaPlusCircle } from "react-icons/fa";
import { LuNotebookPen } from "react-icons/lu";
import { PiNotebookFill } from "react-icons/pi";

import TopicForm from "../Components/TopicForm";
import Sidebar from "../Components/Sidebar";
import FinalResult from "../Components/FinalResult";

const Notes = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Safely grab user data from redux store
  const { userData } = useSelector((state) => state.user);
  const credits = userData?.user?.credits ?? 0;

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-100 to-gray-200 px-6 py-8">
      {/* HEADER */}
      <motion.header
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/10 px-8 py-6 shadow-[0_20px_45px_rgba(0,0,0,0.6)] flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div onClick={() => navigate("/")} className="cursor-pointer">
          <h1 className="text-2xl font-bold bg-linear-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
            ExamNotes AI
          </h1>
          <p className="text-sm text-gray-300 mt-1">
            AI-powered exam-oriented notes and revision
          </p>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          {/* Changed from <button> to <div> to prevent event bubbling/nesting conflicts */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm select-none">
            <span
              onClick={() => navigate("/pricing")}
              className="text-gray-200 p-2 bg-zinc-700 rounded-2xl backdrop-blur-2xl hover:scale-105 transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer"
            >
              <MdOutlineDiamond size={15} />
              {credits}
              <FaPlusCircle
                size={20}
                className="cursor-pointer hover:scale-110 transition-all duration-150 text-emerald-400"
                onClick={(e) => {
                  e.stopPropagation(); // Stops main container navigate trigger
                  navigate("/pricing");
                }}
              />
            </span>
          </div>

          <button className="px-4 py-3 rounded-full text-sm font-medium bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:scale-105 transition flex items-center gap-2"
            onClick={() => navigate('/history')}>
            <LuNotebookPen />
            My Notes
          </button>
        </div>
      </motion.header>

      {/* FORM */}
      <div className="mb-10">
        <TopicForm
          loading={loading}
          setResult={setResult}
          setLoading={setLoading}
          setError={setError}
        />
      </div>

      {/* LOADING */}
      {loading && (
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
          className="text-center text-black font-medium mb-6"
        >
          🔄 Generating exam-focused notes...
        </motion.div>
      )}

      {/* ERROR */}
      {error && (
        <div className="mb-6 text-center text-red-600 font-medium">
          ⚠️ {error}
        </div>
      )}

      {/* EMPTY STATE */}
      {!result && !loading && (
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="h-64 rounded-2xl flex flex-col items-center justify-center bg-white/60 backdrop-blur-lg border border-dashed border-gray-300 text-gray-500 shadow-inner"
        >
          <p className="flex items-center gap-2 text-base font-medium">
            <PiNotebookFill size={22} className="text-indigo-500" />
            Generated notes will appear here
          </p>
        </motion.div>
      )}

      {/* RESULT */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid lg:grid-cols-4 gap-6"
        >
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <Sidebar result={result} />
            </div>
          </div>

          {/* Main Result */}
          <div className="lg:col-span-3 rounded-2xl bg-white shadow-[0_15px_40px_rgba(0,0,0,0.15)] h-auto">
            <div className="p-6">
              <FinalResult result={result} />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Notes;