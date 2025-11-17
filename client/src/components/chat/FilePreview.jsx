import React from "react";

/* shows a small preview of the uploaded file before sending */
export default function FilePreview({ file, onRemove }) {
  return (
    <div className="ml-3 flex items-center gap-2 bg-gray-100 px-2 py-1 rounded">
      <img src={file.data} alt={file.name} className="h-10 w-10 object-cover rounded" />
      <div className="text-xs">
        <div className="font-medium">{file.name}</div>
        <div className="text-gray-500">Image</div>
      </div>
      <button onClick={onRemove} className="text-xs text-red-500 ml-2">Remove</button>
    </div>
  );
}
