import React from "react";

export default function MessageBubble({ msg, isOwn }) {
  const isSystem = msg.type === "system";

  if (isSystem) {
    return (
      <div className="text-center text-gray-400 text-xs my-2">
        {msg.text}
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col max-w-xs md:max-w-sm ${
        isOwn ? "ml-auto items-end" : "items-start"
      }`}
    >
      <div
        className={`px-4 py-2 rounded-2xl shadow 
        ${isOwn ? "bg-blue-600 text-white" : "bg-white text-gray-800"}`}
      >
        {/* filename for uploads */}
        {msg.fileName && (
          <div className="text-xs underline mb-1">{msg.fileName}</div>
        )}
        {msg.message}
      </div>

      <div className="text-[10px] text-gray-500 mt-1">
        {new Date(msg.timestamp).toLocaleTimeString()}
        {isOwn && msg.status === "sending" && " • Sending..."}
        {isOwn && msg.status === "sent" && " ✓"}
        {isOwn && msg.status === "delivered" && " ✓✓"}
      </div>
    </div>
  );
}
