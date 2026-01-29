import { useState } from "react";
import { X, Upload } from "lucide-react";
import toast from "react-hot-toast";
import documentService from "../../services/documentService";

function UploadDocumentModal({ isOpen, onClose, onUploaded }) {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleUpload = async () => {
    if (!title || !file) {
      toast.error("Title and file are required");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("file", file);

      await documentService.uploadDocument(formData);

      toast.success("Document uploaded successfully");
      onUploaded();
      onClose();
      setTitle("");
      setFile(null);
    } catch (err) {
      toast.error("Upload failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Upload Document</h2>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Title */}
        <div className="mb-4">
          <label className="text-sm text-neutral-600">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="
              mt-1 w-full px-3 py-2
              border rounded-lg
              focus:ring-2 focus:ring-blue-500 outline-none
            "
            placeholder="Enter document title"
          />
        </div>

        {/* File */}
        <div className="mb-6">
          <label className="text-sm text-neutral-600">File</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="mt-1 block w-full text-sm"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border hover:bg-neutral-100"
          >
            Cancel
          </button>

          <button
            onClick={handleUpload}
            disabled={loading}
            className="
              flex items-center gap-2
              bg-blue-600 text-white
              px-4 py-2 rounded-lg
              hover:bg-blue-700
              disabled:opacity-50
            "
          >
            <Upload size={16} />
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default UploadDocumentModal;
