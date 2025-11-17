import React, { useState } from 'react'

export default function Login({ onLogin }) {
  const [name, setName] = useState('')

  const handleJoin = () => {
    if (name.trim()) {
      onLogin(name.trim())
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleJoin()
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 sm:p-8 bg-gradient-to-br from-blue-600 to-blue-800">
      <div className="w-full max-w-md bg-white rounded-lg shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">Chat Room</h1>
          <p className="text-gray-600">Join the conversation!</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Enter your username
            </label>
            <input
              className="w-full border-2 border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500 transition"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g. John, Alice, User123"
              autoFocus
            />
          </div>

          <button
            className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 font-semibold text-lg transition"
            onClick={handleJoin}
            disabled={!name.trim()}
          >
            Join Chat
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>💬 Real-time chat powered by Socket.io</p>
        </div>
      </div>
    </div>
  )
}
