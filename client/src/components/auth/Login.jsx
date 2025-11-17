import React, { useState } from "react";

/*
  Simple username login screen.
  Replace with JWT flow if required.
*/
export default function Login({ onLogin }) {
  const [name, setName] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-white px-4">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">Welcome to ChatApp</h1>
        <p className="text-sm text-gray-500 mb-4 text-center">Enter a username to start chatting instantly</p>

        <form onSubmit={(e) => { e.preventDefault(); name.trim() && onLogin(name.trim()); }}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Choose a display name"
            className="w-full border px-3 py-2 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Join Chat
          </button>
        </form>

        <div className="mt-4 text-xs text-gray-400 text-center">
          This demo uses username auth. For production, replace with JWT + secure login.
        </div>
      </div>
    </div>
  );
}
