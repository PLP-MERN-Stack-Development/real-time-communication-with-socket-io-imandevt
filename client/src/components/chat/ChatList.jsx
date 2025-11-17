import React from "react";

/* Reusable compact chat list for small screens or pinned sections */
export default function ChatList({ chats = [], onSelect }) {
  return (
    <div className="p-2">
      {chats.map(c => (
        <div key={c.id} onClick={() => onSelect(c)} className="p-2 rounded hover:bg-gray-50 cursor-pointer">
          <div className="flex justify-between">
            <div className="font-medium">{c.title}</div>
            {c.unread > 0 && <div className="text-xs bg-red-500 text-white px-2 rounded-full">{c.unread}</div>}
          </div>
          <div className="text-xs text-gray-500">{c.lastMessage}</div>
        </div>
      ))}
    </div>
  );
}
