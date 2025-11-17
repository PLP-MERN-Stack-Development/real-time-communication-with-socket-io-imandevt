import React, { useState } from "react";

/* lightweight search UI — highlight logic should be implemented on the backend or client */
export default function SearchBar({ placeholder = "Search...", onSearch = (q) => {} }) {
  const [q, setQ] = useState("");
  return (
    <div className="relative">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSearch(q)}
        placeholder={placeholder}
        className="border rounded px-3 py-1 text-sm"
      />
      <button onClick={() => onSearch(q)} className="absolute right-1 top-1 text-sm text-gray-500">Search</button>
    </div>
  );
}
