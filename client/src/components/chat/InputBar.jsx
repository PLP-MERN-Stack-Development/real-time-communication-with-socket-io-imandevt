import React, { useState } from "react";

export default function InputBar({ chatId, onSend, onTyping }) {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);

  const handleSend = () => {
    if (!text && !file) return;

    onSend({
      text,
      file,
      type: file ? "file" : "text",
    });

    setText("");
    setFile(null);
  };

  const handleFilePick = (e) => {
    const f = e.target.files[0];
    if (!f) return;

    const reader = new FileReader();
    reader.onload = () => {
      setFile({ name: f.name, data: reader.result });
    };
    reader.readAsDataURL(f);
  };

  return (
    <div className="p-3 bg-white border-t flex items-center gap-3">
      <input
        type="file"
        className="hidden"
        id="chat-file"
        onChange={handleFilePick}
      />

      <button
        onClick={() => document.getElementById("chat-file").click()}
        className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
      >
        📎
      </button>

      <input
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          onTyping();
        }}
        placeholder="Type a message..."
        className="flex-1 px-3 py-2 border rounded focus:ring w-full"
      />

      <button
        onClick={handleSend}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Send
      </button>
    </div>
  );
}
