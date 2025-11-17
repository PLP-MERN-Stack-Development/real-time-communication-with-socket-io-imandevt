import React from "react";
import ChatList from "../chat/ChatList";

/*
 Sidebar composes:
 - Rooms / Channels at top
 - ChatList (recent chats + unread)
 - Collapsible for mobile (not fully implemented here)
*/
export default function Sidebar({ onlineUsers = [], onSelectChat, selectedChat, unreadCounts }) {
  const rooms = [
    { id: "global", title: "Global" },
    { id: "room1", title: "Room 1" },
    { id: "room2", title: "Room 2" },
  ];

  return (
    <aside className="w-80 border-r bg-white hidden md:block">
      <div className="p-4 border-b flex items-center justify-between">
        <div>
          <h3 className="font-bold">Channels</h3>
          <p className="text-xs text-gray-500">Real-time rooms</p>
        </div>
      </div>

      <div className="p-2 space-y-2">
        {rooms.map(r => (
          <button
            key={r.id}
            onClick={() => onSelectChat({ type: "room", id: r.id, title: r.title })}
            className={`w-full text-left px-3 py-2 rounded ${selectedChat?.id === r.id ? "bg-blue-50 border-l-4 border-blue-600" : "hover:bg-gray-50"}`}
          >
            <div className="flex items-center justify-between">
              <span>{r.title}</span>
              {unreadCounts?.[r.id] > 0 && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{unreadCounts[r.id]}</span>}
            </div>
          </button>
        ))}
      </div>

      <div className="border-t p-4">
        <h4 className="font-semibold mb-2">People online</h4>
        <ul className="space-y-2 max-h-64 overflow-auto no-scrollbar">
          {onlineUsers.map(u => (
            <li key={u.id} className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-green-400" />
              <span className="text-sm">{u.username}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="p-4 border-t text-xs text-gray-500">
        Tip: Click a channel to view messages. Use the search bar to find messages.
      </div>
    </aside>
  );
}
