import React from "react";

export default function OnlineUsers({ onlineUsers, typingUser, currentUser }) {
  return (
    <div className="w-1/4 border-r p-2 flex flex-col">
      <h2 className="font-bold mb-2">Online Users</h2>
      <ul className="space-y-1 flex-1 overflow-y-auto">
        {onlineUsers.map((user) => (
          <li
            key={user.id}
            className={`p-1 rounded ${
              user.username === currentUser ? "bg-gray-300" : "bg-gray-100"
            }`}
          >
            {user.username} {typingUser === user.username && "💬 typing..."}
          </li>
        ))}
      </ul>
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
