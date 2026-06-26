import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import MermaidSetup from "./MermaidSetup";
import RechartSetUp from "./RechartSetUp";
import { pdfDownload } from "../services/api";

const markdownComponents = {
  h1: ({ children }) => (
    <h1 className="text-2xl font-bold text-indigo-700 mt-6 mb-4 border-b pb-2">
      {children}
    </h1>
  ),

  h2: ({ children }) => (
    <h2 className="text-xl font-semibold text-indigo-600 mt-5 mb-3">
      {children}
    </h2>
  ),

  h3: ({ children }) => (
    <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">
      {children}
    </h3>
  ),

  p: ({ children }) => (
    <p className="text-gray-700 leading-relaxed mb-3">{children}</p>
  ),

  ul: ({ children }) => (
    <ul className="list-disc ml-6 space-y-1 text-gray-700">
      {children}
    </ul>
  ),

  li: ({ children }) => (
    <li className="marker:text-indigo-500">{children}</li>
  ),
};

function SectionHeader({ icon, title, color = "indigo" }) {
  const colors = {
    indigo: "from-indigo-100 to-indigo-50 text-indigo-700",
    purple: "from-purple-100 to-purple-50 text-purple-700",
    blue: "from-blue-100 to-blue-50 text-blue-700",
    green: "from-green-100 to-green-50 text-green-700",
    cyan: "from-cyan-100 to-cyan-50 text-cyan-700",
    rose: "from-rose-100 to-rose-50 text-rose-700",
  };

  return (
    <div
      className={`mb-4 px-4 py-2 rounded-lg bg-linear-to-r ${colors[color]
        } font-semibold flex items-center gap-2`}
    >
      <span>{icon}</span>
      <span>{title}</span>
    </div>
  );
}

const FinalResult = ({ result }) => {
  const [quickrevision, setQuickrevision] = useState(false);

  if (
    !result ||
    !result.subTopics ||
    !result.questions ||
    !result.revisionPoints
  ) {
    return null;
  }

  return (
    <div className="mt-6 p-3 space-y-10 bg-white">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-3xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          📚 Generated Notes
        </h2>

        <div className="flex gap-3">
          <button
            onClick={() => setQuickrevision(!quickrevision)}
            className={`px-4 py-2 rounded-lg font-medium transition ${quickrevision
                ? "bg-green-600 text-white"
                : "bg-green-100 text-green-700 hover:bg-green-200"
              }`}
          >
            {quickrevision
              ? "📖 Exit Revision Mode"
              : "⚡ Quick Revision (5 mins)"}
          </button>

          <button className="px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700"
            onClick={() => pdfDownload(result)}>
            📥 Download PDF
          </button>
        </div>
      </div>

      {/* Sub Topics */}
      {!quickrevision && (
        <section>
          <SectionHeader
            icon="📌"
            title="Sub Topics"
            color="indigo"
          />

          {Object.entries(result.subTopics).map(([priority, topics]) => (
            <div
              key={priority}
              className="mb-3 rounded-lg bg-gray-50 border border-gray-200 p-3"
            >
              <p className="text-sm font-semibold text-yellow-600 mb-1">
                🎯 {priority} Priority
              </p>

              <ul className="list-disc ml-4 text-sm text-gray-700 space-y-1">
                {topics.map((topic, index) => (
                  <li key={index}>{topic}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {/* Notes */}
      {!quickrevision && (
        <section>
          <SectionHeader
            icon="📖"
            title="Detailed Notes"
            color="blue"
          />

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <ReactMarkdown components={markdownComponents}>
              {result.notes}
            </ReactMarkdown>
          </div>
        </section>
      )}

      {/* Quick Revision */}
      {quickrevision && (
        <section>
          <SectionHeader
            icon="🚀"
            title="Quick Revision Points"
            color="green"
          />

          <div className="bg-green-50 border border-green-200 rounded-xl p-5">
            <ul className="list-disc ml-5 space-y-2">
              {result.revisionPoints.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Diagram */}
      {result.diagram?.data && (
        <section>
          <SectionHeader
            icon="🧩"
            title="Diagram"
            color="cyan"
          />

          <MermaidSetup diagram={result.diagram.data} />

          <p className="mt-3 text-xs text-gray-500 italic">
            📸 Save this diagram by taking a screenshot for future revision.
          </p>
        </section>
      )}

      {result.questions.diagram && (
        <section className="bg-cyan-50/50 border border-cyan-100 rounded-xl p-4 mt-2">
          <p className="font-medium flex items-center gap-2 text-cyan-800">
            🎨 Diagram Questions
          </p>

          <ul className="list-disc ml-6 text-gray-700 mt-2">
            <li>{result.questions.diagram}</li>
          </ul>
        </section>
      )}

      {/* Visual Charts */}
      {result.charts?.length > 0 && (
        <section>
          <SectionHeader icon="📊" title="Visual Charts" color="indigo" />
          <RechartSetUp charts={result.charts} />
          <p className="mt-3 text-xs text-gray-500 italic">
            📸 Save this chart by taking a screenshot for future revision.
          </p>
        </section>
      )}

      {result.charts && result.charts.length === 0 && (
        <p className="text-sm text-gray-400 italic flex items-center gap-1">
          📉 Charts are not relevant for this topic
        </p>
      )}

      {/* Questions */}
      <section>
        <SectionHeader
          icon="❓"
          title="Important Questions"
          color="rose"
        />

        <div className="space-y-4">
          <div>
            <p className="font-medium flex items-center gap-2 text-gray-800">
              📝 Short Questions
            </p>
            <ul className="list-disc ml-6 text-gray-700 mt-2 space-y-1">
              {result.questions.short?.map((question, index) => (
                <li key={index}>{question}</li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-medium flex items-center gap-2 text-gray-800">
              ✍️ Long Questions
            </p>
            <ul className="list-disc ml-6 text-gray-700 mt-2 space-y-1">
              {result.questions.long?.map((question, index) => (
                <li key={index}>{question}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FinalResult;