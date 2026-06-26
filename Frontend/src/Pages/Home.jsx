import React from "react";
import Navbar from "../Components/Navbar";
import { motion } from "motion/react";
import img from "../assets/img1.webp";
import AuthCard from "../Components/AuthCard";
import Footer from "../Components/Footer";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const cards = [
    {
      title: "Exam Notes",
      des: "Generate exam-ready notes instantly with AI-powered summaries and structured content.",
    },
    {
      title: "Project Reports",
      des: "Create professional project reports with proper formatting and clean layouts.",
    },
    {
      title: "Charts & Graphs",
      des: "Visualize complex concepts and data using AI-generated charts and diagrams.",
    },
    {
      title: "PDF Export",
      des: "Download beautifully formatted PDFs ready for study, revision, or submission.",
    },
  ];
  return (
    <div className="min-h-screen overflow-hidden bg-white text-black">
      <Navbar />

      {/* top */}
      <section className="max-w-7xl mx-auto px-8 pt-32 grid grid-cols-1 lg:grid-cols-2 gap gap-20 iems-center">
        <div>
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            whileHover={{ rotateX: 6, rotateY: -6 }}
            className="transform-gpu"
            style={{ transformStyle: "preserve-3d" }}
          >
            <motion.h1
              className="text-5xl font-extrabold leading-tight bg-linear-to-br from-black/90 via-black/60 to-black/90 bg-clip-text text-transparent"
              whileHover={{ y: -4 }}
              style={{
                transform: "translateZ40px)",
                textShadow: "0 18px 40px rgba(0,0,0,0.25)",
              }}
            >
              Create Smart <br />
              AI Notes in Seconds
            </motion.h1>
            <motion.p
              whileHover={{ y: -2 }}
              className="mt-6 max-w-xl text-lg bg-linear-to-br from-gray-700 via-gray-500/80 to-gray-700 bg-clip-text text-transparent"
              style={{
                transform: "translateZ40px)",
                textShadow: "0 18px 40px rgba(0,0,0,0.25)",
              }}
            >
              Generate exam-focused notes,project documentation,flow diagrams
              and revision-ready constent using AI-faster,cleaner and smarter
            </motion.p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="mt-8 px-6 py-3 rounded-xl flex items-center gap-3 bg-linear-to-br from-black/90 via-black/80 to-black/90 backdrop-blur-2xl border border-white/10 text-white text-sm font-medium shadow-[0_30px_80px_rgba(0,0,0,0.7)] hover:border-white/20 transition-all duration-100"
              onClick={() => navigate("/notes")}
            >
              Get Started
            </motion.button>
          </motion.div>
        </div>
        <div>
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            whileHover={{
              y: -12,
              rotateX: 8,
              rotateY: -8,
              scale: 1.05,
            }}
            className="transform-gpu"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="overflow-hidden max-w-80 ml-20">
              <img src={img} alt="" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* bottom */}
      <section className="max-w-6xl mx-auto px-8 py-32 grid grid-cols-1 md:grid-cols-4 gap-10">
        {cards.map((card, index) => (
          <AuthCard key={index} title={card.title} des={card.des} />
        ))}
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
