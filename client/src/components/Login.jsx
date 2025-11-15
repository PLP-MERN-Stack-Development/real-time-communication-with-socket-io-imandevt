import React, { useState } from 'react'

export default function Login({ onLogin }) {
  const [name, setName] = useState('')

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 sm:p-8 bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-center">Enter Username</h1>
        <input
          className="border p-3 mb-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
        />
        <button
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => name.trim() && onLogin(name.trim())}
        >
          Join Chat
        </button>
      </div>
    </div>
  )
}
