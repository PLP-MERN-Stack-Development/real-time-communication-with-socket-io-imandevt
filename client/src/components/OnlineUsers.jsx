import React from 'react'

export default function OnlineUsers({ onlineUsers = [], typingUser = '', currentUser = '' }) {
  return (
    <div className="w-full md:w-64 border-b md:border-b-0 md:border-r p-4 bg-white h-auto md:overflow-y-auto">
      <h2 className="font-bold mb-3 text-lg">Online Users ({onlineUsers.length})</h2>
      <ul className="space-y-2">
        {onlineUsers.length === 0 ? (
          <li className="text-gray-400 text-sm">No users online</li>
        ) : (
          onlineUsers.map((user) => (
            <li
              key={user}
              className={`flex items-center gap-2 ${user === currentUser ? 'font-semibold text-green-600' : 'text-gray-700'}`}
            >
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              <span className="truncate">{user}</span>
              {typingUser === user && <span className="text-sm text-gray-500">(typing...)</span>}
            </li>
          ))
        )}
      </ul>
    </div>
  )
}
