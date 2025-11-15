import React from "react";

export default function MessageInput({ message, setMessage, onSend, onTyping }) {
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="p-2 border-t flex gap-2 items-center">
      <textarea
        className="flex-1 p-2 border rounded resize-none focus:outline-none"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyPress}
        onInput={onTyping}
      />

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={onSend}
      >
        Send
      </button>
    </div>
  );
}
