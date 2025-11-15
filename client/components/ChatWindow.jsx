import React from "react";

export default function ChatWindow({ messages }) {
  return (
    <div className="flex-1 p-4 overflow-y-auto bg-gray-100 space-y-3">
      {messages.map((msg) => (
        <div
          key={msg._id || Math.random()}
          className={`flex flex-col ${
            msg.sender === "You" ? "items-end" : "items-start"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">{msg.sender}</span>
            <span className="text-xs text-gray-500">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </span>
          </div>

          <div
            className={`mt-1 p-2 rounded-lg ${
              msg.sender === "You"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-900"
            } max-w-xs break-words`}
          >
            {msg.type === "image" ? (
              <img
                src={msg.message}
                alt={msg.fileName || "image"}
                className="max-w-xs rounded"
              />
            ) : (
              <span>{msg.message}</span>
            )}
          </div>

          {/* Reactions */}
          {msg.reactions && Object.keys(msg.reactions).length > 0 && (
            <div className="flex gap-2 mt-1 text-sm">
              {Object.entries(msg.reactions).map(([reaction, users]) => (
                <span key={reaction} className="flex items-center gap-1">
                  {reaction} {users.length}
                </span>
              ))}
            </div>
          )}

          {/* Read receipt */}
          {msg.read && (
            <span className="text-xs text-gray-400 mt-0.5">✓ Read</span>
          )}
        </div>
      ))}
    </div>
  );
}
<div className="flex-1 p-4 overflow-y-auto bg-gray-100 space-y-3">
  {messages.map(msg => (
    <div
      key={msg.id}
      className={`flex flex-col ${msg.sender === "You" ? "items-end" : "items-start"}`}
    >
      <div className="mt-1 p-2 rounded-lg bg-white text-gray-900 max-w-xs break-words">
        {msg.message}
      </div>
    </div>
  ))}
</div>
