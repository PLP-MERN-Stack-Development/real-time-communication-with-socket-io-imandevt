import React from "react";

/* simple toggle button for sound notifications */
export default function NotificationToggle({ enabled, onToggle }) {
  return (
    <button onClick={() => onToggle(!enabled)} className="flex items-center gap-2 px-3 py-1 rounded bg-gray-100 hover:bg-gray-200">
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M15 8a3 3 0 00-6 0v1.1A5 5 0 005 14v1h14v-1a5 5 0 00-4-4.9V8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      <span className="text-sm">{enabled ? "Sound On" : "Sound Off"}</span>
    </button>
  );
}
