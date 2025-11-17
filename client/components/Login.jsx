import React, { useState } from "react";

export default function Login({ onLogin }) {
  const [name, setName] = useState("");

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-2xl font-bold mb-4">Enter Your Username</h1>
      <input
        type="text"
        placeholder="Username"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 rounded mb-4 focus:outline-none"
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={() => name.trim() && onLogin(name)}
      >
        Join Chat
      </button>
    </div>
  );
}
<div className="bg-red-500 text-white p-4">TEST TAILWIND</div>
