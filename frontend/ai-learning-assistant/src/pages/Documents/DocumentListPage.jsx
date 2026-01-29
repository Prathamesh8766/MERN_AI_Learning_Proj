import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Button from "../../components/common/Button";
import UploadDocumentModal from "../../components/documents/UploadDocumentModal";
import documentService from "../../services/documentService";
import Spinner from "../../components/common/Spinner";

import {
  FileText,
  BookOpen,
  Brain,
  Clock,
  TrendingUp,
  Trash2,
  Upload,
} from "lucide-react";

function DocumentListPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openUpload, setOpenUpload] = useState(false);

  const navigate = useNavigate();

  const fetchDocuments = async () => {
    try {
      const data = await documentService.getDocuments();
      setDocuments(data);
    } catch {
      toast.error("Failed to fetch documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleDelete = async (e, docId) => {
    e.stopPropagation();
    if (!window.confirm("Delete this document?")) return;

    try {
      await documentService.deleteDocument(docId);
      setDocuments((prev) => prev.filter((d) => d._id !== docId));
      toast.success("Document deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  if (loading) return <Spinner />;

  if (!documents.length) {
    return (
      <div className="flex items-center justify-center h-full text-neutral-500">
        <TrendingUp size={32} />
        <p className="ml-2">No documents available</p>
      </div>
    );
  }

  const formatDateTime = (date) =>
    new Date(date).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatSize = (bytes) => {
    if (!bytes) return "—";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="h-full bg-neutral-200/60 p-6 flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Documents</h1>
          <p className="text-neutral-500">
            All your uploaded learning material
          </p>
        </div>

        <Button onClick={() => setOpenUpload(true)}>
          <Upload size={16} />
          Upload
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide pt-6">
        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pr-2 ">
          {documents.map((doc) => (
            <div
              key={doc._id}
              onClick={() => navigate(`/documents/${doc._id}`)}
              className="
                group relative cursor-pointer
                bg-white rounded-2xl border
                p-5 h-[220px]
                shadow-md
                transition-all duration-300 ease-out
                hover:shadow-xl hover:-translate-y-1
                hover:border-blue-400
              "
            >
              {/* 🗑 Delete Icon (hover only) */}
              <button
                onClick={(e) => handleDelete(e, doc._id)}
                className="
                  absolute top-3 right-3
                  opacity-0 group-hover:opacity-100
                  transition-opacity duration-200
                  p-2 rounded-full
                  bg-red-50 text-red-600
                  hover:bg-red-100 hover:text-red-700
                  shadow-sm
                "
              >
                <Trash2 size={16} />
              </button>

              {/* Document Icon */}
              <div className="mb-3">
                <div
                  className="
                        w-10 h-10 rounded-lg
                        bg-gradient-to-br from-blue-500 to-cyan-500
                        text-white
                        flex items-center justify-center
                        shadow-md
                      "
                >
                  <FileText size={20} />
                </div>
              </div>


              {/* Title */}
              <h2 className="text-lg font-semibold text-neutral-800 line-clamp-2">
                {doc.title}
              </h2>

              {/* File Size */}
              <p className="text-sm text-neutral-500 mt-1">
                {formatSize(doc.fileSize)}
              </p>

              {/* Flashcards & Quizzes */}
              <div className="flex justify-center gap-3 mt-3">
                <div
                  className="
                    flex items-center gap-1
                    px-3 py-1
                    rounded-full
                    bg-blue-50 text-blue-700
                    border border-blue-100
                    text-xs font-medium
                    hover:bg-blue-100 transition
                  "
                >
                  <BookOpen size={13} />
                  <span>{doc.flashcardCount}</span>
                  <span>Flashcards</span>
                </div>

                <div
                  className="
                    flex items-center gap-1
                    px-3 py-1
                    rounded-full
                    bg-purple-50 text-purple-700
                    border border-purple-100
                    text-xs font-medium
                    hover:bg-purple-100 transition
                  "
                >
                  <Brain size={13} />
                  <span>{doc.quizCount}</span>
                  <span>Quizzes</span>
                </div>
              </div>

              {/* Uploaded Date */}
              <div className="flex items-center gap-1 text-xs text-neutral-400 mt-4">
                <Clock size={14} />
                <span>{formatDateTime(doc.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Modal */}
      <UploadDocumentModal
        isOpen={openUpload}
        onClose={() => setOpenUpload(false)}
        onUploaded={fetchDocuments}
      />
    </div>
  );
}

export default DocumentListPage;
