import React, { useState } from "react";

/*
 MessageBubble supports:
 - text & image messages
 - system messages
 - read receipts
 - reactions (show badges)
 - delivery status (sending, sent, delivered, failed)
*/

export default function MessageBubble({ message }) {
  const [showReactor, setShowReactor] = useState(false);
  // reactions is a Map-like object: { "👍": ["Alice","Bob"], "❤️": ["Bob"] }
  const reactions = message.reactions || {};

  // helper formatting
  const time = message.timestamp ? new Date(message.timestamp).toLocaleTimeString() : "";

  // If system message
  if (message.type === "system") {
    return (
      <div className="flex justify-center">
        <div className="text-xs text-gray-500 px-3 py-1 bg-white rounded">{message.text}</div>
      </div>
    );
  }

  const isMe = message.senderId === "me" || message.sender === "You";

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[70%] space-y-1 ${isMe ? "text-right" : "text-left"}`}>
        <div className="text-xs text-gray-500">{message.sender} <span className="ml-2 text-gray-400">{time}</span></div>

        <div className={`inline-block p-3 rounded-lg ${isMe ? "bg-blue-600 text-white" : "bg-white text-gray-900"} shadow`}>
          {message.type === "image" ? (
            <img src={message.message} alt={message.fileName || "image"} className="max-w-full rounded" />
          ) : (
            <div>{message.message}</div>
          )}
        </div>

        {/* Reactions */}
        <div className="flex gap-2 items-center mt-1">
          {Object.entries(reactions).map(([emoji, users]) => (
            <div key={emoji} className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-full text-sm">
              <span>{emoji}</span>
              <span className="text-xs text-gray-600">{users.length}</span>
            </div>
          ))}

          {/* delivery/read status */}
          <div className="text-xs text-gray-400 ml-2">
            {message.status === "sending" ? "Sending..." : message.read ? "Seen" : (message.status === "failed" ? "Failed" : "Sent")}
          </div>

          {/* reaction button */}
          <button onClick={() => setShowReactor(s => !s)} className="ml-2 text-xs text-gray-500">React</button>
        </div>

        {showReactor && (
          <div className="mt-1 flex gap-2">
            {["👍","❤️","😂","🎉","😮"].map(e => (
              <button key={e} className="px-2" onClick={() => {
                // placeholder: call server to add reaction
                // socket.emit('add_reaction', { messageId: message._id, emoji: e });
                alert(`Reacted ${e} (mock)`);
              }}>{e}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
