import React, { useEffect, useRef, useState } from "react";
import MessageBubble from "./MessageBubble";

export default function ChatWindow({
  chatId,
  messages = [],
  onLoadOlder,
  onMarkRead,
}) {
  const containerRef = useRef(null);
  const [page, setPage] = useState(1);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
    onMarkRead();
  }, [messages]);

  const handleLoadOlder = () => {
    setPage((p) => p + 1);
    onLoadOlder(page + 1);
  };

  return (
    <div className="flex flex-col flex-1 bg-slate-100">
      <button
        onClick={handleLoadOlder}
        className="mx-auto mt-2 text-sm text-blue-600 hover:underline"
      >
        Load older messages
      </button>

      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.map((msg, index) => (
          <MessageBubble key={index} msg={msg} isOwn={msg.senderId === "me"} />
        ))}
      </div>
    </div>
  );
}
