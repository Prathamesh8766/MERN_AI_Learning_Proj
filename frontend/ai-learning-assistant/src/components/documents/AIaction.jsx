import { useState } from "react";
import SummaryModal from "./SummaryModal";
import ExplainModal from "./ExplainModal";

function AIActionButtons({ documentId }) {
  const [openSummary, setOpenSummary] = useState(false);
  const [openExplain, setOpenExplain] = useState(false);

  return (
    <>
      <div className="flex gap-4">
        <button
          onClick={() => setOpenSummary(true)}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg"
        >
          Generate Summary
        </button>

        <button
          onClick={() => setOpenExplain(true)}
          className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg"
        >
          Explain Concept
        </button>
      </div>

      {openSummary && (
        <SummaryModal
          documentId={documentId}
          onClose={() => setOpenSummary(false)}
        />
      )}

      {openExplain && (
        <ExplainModal
          documentId={documentId}
          concept="Battery Management System"
          onClose={() => setOpenExplain(false)}
        />
      )}
    </>
  );
}

export default AIActionButtons;
