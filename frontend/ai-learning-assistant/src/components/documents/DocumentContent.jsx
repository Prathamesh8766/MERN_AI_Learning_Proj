function Content({ filePath, fileName, loading }) {

  const getUrl = () => {
    if (!filePath) return null;

    // already full URL
    if (
      filePath.startsWith("http://") ||
      filePath.startsWith("https://")
    ) {
      return filePath;
    }

    // relative path
    const baseUrl = process.env.REACT_APP_API || "http://localhost:8000";

    return `${baseUrl}${filePath.startsWith("/") ? "" : "/"}${filePath}`;
  };

  const pdfUrl = getUrl();

  if (loading) {
    return <p className="text-center">Loading...</p>;
  }

  if (!pdfUrl) {
    return <p className="text-center">No PDF available</p>;
  }

  return (
    <div className="border rounded-lg overflow-hidden">

      {/* HEADER */}
      <div className="flex justify-between items-center px-4 py-3 border-b bg-gray-50">
        <span className="text-sm font-medium text-gray-700">
          {fileName}
        </span>

        <button
          className="text-sm text-emerald-600 hover:underline"
          onClick={() => window.open(pdfUrl, "_blank")}
        >
          Open in new tab
        </button>
      </div>

      {/* PDF VIEWER */}
      <div className="h-[75vh]">
        <iframe
          src={pdfUrl}
          className="w-full h-full"
          title="Document Viewer"
        />
      </div>

    </div>
  );
}

export default Content;
