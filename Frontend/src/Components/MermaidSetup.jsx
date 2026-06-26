import React, { useRef, useEffect, useState } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: false,
  theme: "default",
  // Suppresses Mermaid from appending its own ugly error boxes onto document.body
  suppressErrorRendering: true,
  securityLevel: "loose"
});

const cleanMermaidChart = (diagram) => {
  if (!diagram) return "";

  let clean = diagram
    .replace(/\r?\n/g, "\n")
    .trim();

  // If the diagram text is wrapped inside standard markdown code blocks, strip them out
  if (clean.startsWith("```mermaid")) {
    clean = clean.replace(/^```mermaid\s*|\s*```$/g, "").trim();
  } else if (clean.startsWith("```")) {
    clean = clean.replace(/^```\s*|\s*```$/g, "").trim();
  }

  // Ensure it starts with a valid diagram type declaration
  if (!/^(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|erDiagram|gantt|pie|gitGraph|journey|C4|mindmap|timeline)/i.test(clean)) {
    clean = `graph TD\n${clean}`;
  }

  return clean;
};


const autoFixBadNodes = (diagram) => {
  if (!diagram) return "";

  // 1. Match bracket formats: [text], (text), ([text]), {text}, etc.
  // This matches a node id followed by brackets containing labels that aren't already quoted
  return diagram.replace(/([a-zA-Z0-9_\-]+)\s*(\[|\(|\(\[|\{)\s*([^"\r\n]+?)\s*(\]|\)|\)\]|\})/g,
    (match, id, openBracket, label, closeBracket) => {
      // If the label is already wrapped inside double quotes, leave it alone
      if (label.startsWith('"') && label.endsWith('"')) {
        return match;
      }
      // Safely escape any stray inner quotes and wrap the whole label in strict v11 double quotes
      const safeLabel = label.replace(/"/g, '\\"');
      return `${id}${openBracket}"${safeLabel}"${closeBracket}`;
    }
  );
};

function MermaidSetup({ diagram }) {
  const containerRef = useRef(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!diagram || !containerRef.current) return;

    const renderDiagram = async () => {
      try {
        setError(false);
        containerRef.current.innerHTML = "";

        // Generate a clean random alpha-numeric ID string
        const uniqueId = `mermaid-${Math.random().toString(36).substring(2, 9)}`;

        const cleanedChart = cleanMermaidChart(diagram);
        const safeChart = autoFixBadNodes(cleanedChart);

        // Run the async compilation render call
        const { svg } = await mermaid.render(uniqueId, safeChart);

        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch (err) {
        console.error("Mermaid v11 render engine failed:", err);
        setError(true);

        // Clear broken artifact elements or error boxes out of the DOM frame
        if (containerRef.current) containerRef.current.innerHTML = "";

        // Clean up any rogue error frames Mermaid v11 sometimes dumps outside our container
        const strayErrorElement = document.getElementById(`d${containerRef.current?.firstChild?.id}`);
        if (strayErrorElement) strayErrorElement.remove();
      }
    };

    renderDiagram();
  }, [diagram]);

  return (
    <div className='bg-white border rounded-lg p-4 overflow-x-auto min-h-25 flex items-center justify-center shadow-xs'>
      {error ? (
        <div className="text-sm text-red-500 font-medium flex flex-col items-center gap-1.5 p-4 text-center">
          <span>⚠️ Diagram formatting syntax error.</span>
          <span className="text-xs text-gray-400 font-normal font-mono max-w-md bg-gray-50 p-2 rounded border border-gray-100">
            AI generated unsupported layout markers. Take a screenshot from the viewer dashboard if required.
          </span>
        </div>
      ) : (
        <div ref={containerRef} className="w-full flex justify-center" />
      )}
    </div>
  );
}

export default MermaidSetup;