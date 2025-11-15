import React from 'react'

export default function OnlineUsers({ onlineUsers = [], typingUser = '', currentUser = '' }) {
  return (
    <div className="w-full md:w-1/4 border-b md:border-b-0 md:border-r p-4 bg-white">
      <h2 className="font-bold mb-3">Online Users</h2>
      <ul className="space-y-2">
        {onlineUsers.map((user) => (
          <li
            key={user.id || user}
            className={`flex items-center gap-2 mb-1 ${user === currentUser ? 'font-semibold text-green-600' : 'text-gray-700'}`}
          >
            <span className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-sm text-blue-800">{(user || '').charAt(0)?.toUpperCase()}</span>
            <span className="truncate">{user} {typingUser === user ? <span className="text-sm text-gray-500">(typing...)</span> : null}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
