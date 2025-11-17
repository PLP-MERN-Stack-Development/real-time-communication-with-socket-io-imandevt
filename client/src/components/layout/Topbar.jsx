import React from "react";

export default function Topbar({ username }) {
  return (
    <header className="bg-white border-b px-4 py-2 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="text-xl font-bold">ChatApp</div>
        <div className="text-sm text-gray-500">Real-time messaging</div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-sm text-gray-600">Signed in as <span className="font-semibold">{username}</span></div>
      </div>
    </header>
  );
}
