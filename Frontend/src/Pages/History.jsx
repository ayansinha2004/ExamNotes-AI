import React, { useState, useEffect } from "react";
import axios from "axios";
import FinalResult from "../Components/FinalResult.jsx";
import Navbar from "../Components/Navbar.jsx";
import { serverUrl } from "../App.jsx";
import { Menu, X, Layers, Bookmark } from "lucide-react"; // Lightweight utility icons

export const History = () => {
  const [threads, setThreads] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile drawer state controller

  // Fetch all saved note threads for the logged-in user
  useEffect(() => {
    const fetchHistoryThreads = async () => {
      try {
        const response = await axios.get(`${serverUrl}/api/notes/getnotes`, {
          withCredentials: true,
        });

        const notesData = response.data.success ? response.data.data : response.data;

        if (Array.isArray(notesData)) {
          setThreads(notesData);
          if (notesData.length > 0) {
            setSelectedNote(normalizeNoteData(notesData[0]));
          }
        }
      } catch (err) {
        console.error("Failed to load user thread history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoryThreads();
  }, []);

  const normalizeNoteData = (note) => {
    if (!note) return null;
    const coreContent = note.content || note;

    return {
      ...note,
      subTopics: note.subTopics || coreContent.subTopics || {},
      questions: note.questions || coreContent.questions || { short: [], long: [] },
      revisionPoints: note.revisionPoints || coreContent.revisionPoints || note.revisionPointsArray || [],
      notes: note.notes || coreContent.notes || "",
      diagram: note.diagram || coreContent.diagram || { data: "" },
      charts: note.charts || coreContent.charts || []
    };
  };

  const handleThreadSelect = (thread) => {
    const preparedData = normalizeNoteData(thread);
    setSelectedNote(preparedData);
    setIsSidebarOpen(false); // Auto-closes mobile slide out window drawer layout on selection
  };

  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-[#1c1c1e] font-sans">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-white">
          <p className="text-sm font-medium tracking-wide animate-pulse">
            Syncing workspace logs...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-white font-sans relative">

      {/* 1. TOP GLOBAL NAVBAR */}
      <Navbar />

      {/* 2. MOBILE HEADER BAR BAR (Visible only on Screens smaller than LG layout breakpoint) */}
      <div className="lg:hidden w-full bg-[#1c1c1e] text-white px-4 py-3 flex items-center justify-between border-b border-[#2c2c2e] shrink-0 z-30 shadow-md">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-1.5 rounded-lg bg-[#2c2c2e] active:scale-95 transition-all text-gray-200 hover:text-white"
        >
          <Menu size={20} />
        </button>
        <span className="text-xs font-semibold tracking-wide text-gray-300 truncate max-w-50">
          {selectedNote ? `📖 ${selectedNote.topic}` : "History Archive"}
        </span>
        <div className="flex items-center gap-1 bg-[#2c2c2e] px-2.5 py-0.5 rounded-full text-[10px] font-bold text-indigo-400">
          <span>💎 {threads.length}</span>
        </div>
      </div>

      {/* 3. DUAL PANEL LAYOUT ENGINE */}
      <div className="flex flex-1 h-[calc(100vh-64px)] lg:h-full overflow-hidden relative">

        {/* ==========================================
            BACKDROP DIMMER OVERLAY (Mobile Viewports Only)
           ========================================== */}
        {isSidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-xs z-40 transition-opacity duration-300"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* ==========================================
            DYNAMIC SIDEBAR LAYER (Sliding Menu Architecture)
           ========================================== */}
        <aside className={`
          fixed inset-y-0 left-0 z-50 lg:z-auto lg:static
          w-80 h-full lg:h-[calc(100vh-100px)] 
          bg-[#1c1c1e] text-slate-200 flex flex-col shrink-0 
          lg:mt-5 lg:ml-5 lg:mb-5 lg:rounded-2xl shadow-2xl lg:shadow-xl border-r lg:border border-[#2c2c2e]
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}>

          {/* Sidebar Action Header Block */}
          <div className="p-5 border-b border-[#2c2c2e] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bookmark size={16} className="text-indigo-400" />
              <h2 className="text-sm font-semibold text-gray-200 tracking-wide">Saved Threads</h2>
            </div>

            {/* Mobile Close Button Container Toggle */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-1 rounded-lg hover:bg-[#2c2c2e] text-gray-400 hover:text-white"
            >
              <X size={18} />
            </button>

            {/* Desktop Count Tag */}
            <div className="hidden lg:flex items-center gap-1.5 bg-[#2c2c2e] px-3 py-1 rounded-full text-xs font-medium text-gray-300">
              <span>💎</span>
              <span>{threads.length} Total</span>
            </div>
          </div>

          {/* Navigational Links Navigation Grid Section */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2.5 scrollbar-thin scrollbar-thumb-neutral-800">
            {threads.length === 0 ? (
              <p className="text-xs text-gray-500 text-center mt-8 px-4 italic">
                No history entries found.
              </p>
            ) : (
              threads.map((thread) => {
                const isSelected = selectedNote?._id === thread._id;
                return (
                  <button
                    key={thread._id}
                    onClick={() => handleThreadSelect(thread)}
                    className={`w-full text-left p-4 rounded-xl flex flex-col gap-1.5 transition-all duration-200 shadow-xs border ${isSelected
                        ? "bg-[#2c2c2e] text-white border-indigo-500/40"
                        : "bg-[#242426]/40 text-gray-400 border-transparent hover:bg-[#2c2c2e]/60 hover:text-gray-200"
                      }`}
                  >
                    <span className={`font-bold text-sm line-clamp-1 tracking-tight ${isSelected ? 'text-white' : 'text-gray-200'}`}>
                      {thread.topic || "Untitled Topic"}
                    </span>

                    <div className="flex items-center justify-between text-[11px] font-medium opacity-75 w-full">
                      <span className="bg-white/10 text-gray-300 px-2 py-0.5 rounded-md font-sans truncate max-w-30">
                        {thread.examType || "Boards"}
                      </span>
                      <span className="text-gray-400 font-mono shrink-0">
                        {thread.createdAt ? new Date(thread.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric'
                        }) : ""}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* ==========================================
            RIGHT CONTENT RECEPTACLE AREA
           ========================================== */}
        <main className="flex-1 h-full overflow-y-auto bg-white px-4 md:px-8 py-5 scrollbar-thin">
          {selectedNote ? (
            <div className="w-full h-auto max-w-full overflow-x-hidden">
              <FinalResult result={selectedNote} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-2 p-4 text-center">
              <Layers size={36} className="text-indigo-500 animate-bounce" />
              <p className="text-sm font-semibold text-gray-700">Select a historical thread card</p>
              <p className="text-xs text-gray-400 max-w-xs">Launch note presentations dashboards by selecting dynamic items via slider menu profiles.</p>
            </div>
          )}
        </main>

      </div>
    </div>
  );
};

export default History;