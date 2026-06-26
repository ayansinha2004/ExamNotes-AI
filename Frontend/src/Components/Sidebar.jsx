import React from "react";

const Sidebar = ({ result }) => {
  if (
    !result ||
    !result.subTopics ||
    !result.questions ||
    !result.questions.short ||
    !result.questions.long
  ) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-6">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold text-indigo-600">
          Quick Exam View
        </h3>
      </div>

      <section>
        <p className="text-sm font-semibold text-gray-700 mb-3">
          Sub Topics (Priority Wise)
        </p>

        {Object.entries(result.subTopics).map(([star, topics]) => (
          <div
            key={star}
            className="mb-3 rounded-lg bg-gray-50 border border-gray-200 p-3"
          >
            <p className="text-sm font-semibold text-yellow-600 mb-1">
              {star}
            </p>

            <ul className="list-disc ml-4 text-sm text-gray-700 space-y-1">
              {topics.map((topic, index) => (
                <li key={index}>{topic}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="rounded-lg bg-yellow-50 border border-yellow-200 p-3">
        <p className="text-sm font-semibold text-gray-700 mb-2">
          Exam Importance
        </p>

        <span className="text-yellow-700 font-bold text-sm">
          {result.importance}
        </span>

        <div className="mt-4">
          <p className="text-sm font-semibold text-gray-700 mb-3">
            Important Questions
          </p>

          {/* Short Questions */}
          {result.questions.short?.length > 0 && (
            <div className="mb-4 rounded-lg bg-green-50 border border-green-200 p-3">
              <p className="text-sm font-medium text-green-700 mb-2">
                Short Questions
              </p>

              <ul className="list-disc ml-4 text-sm text-gray-700 space-y-1">
                {result.questions.short.map((question, index) => (
                  <li key={index}>{question}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Long Questions */}
          {result.questions.long?.length > 0 && (
            <div className="mb-4 rounded-lg bg-indigo-50 border border-indigo-200 p-3">
              <p className="text-sm font-medium text-indigo-700 mb-2">
                Long Questions
              </p>

              <ul className="list-disc ml-4 text-sm text-gray-700 space-y-1">
                {result.questions.long.map((question, index) => (
                  <li key={index}>{question}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Diagram Questions */}
          {Array.isArray(result.questions.diagram) &&
            result.questions.diagram.length > 0 && (
              <div className="rounded-lg bg-purple-50 border border-purple-200 p-3">
                <p className="text-sm font-medium text-purple-700 mb-2">
                  Diagram Questions
                </p>

                <ul className="list-disc ml-4 text-sm text-gray-700 space-y-1">
                  {result.questions.diagram.map((question, index) => (
                    <li key={index}>{question}</li>
                  ))}
                </ul>
              </div>
            )}
        </div>
      </section>
    </div>
  );
};

export default Sidebar;