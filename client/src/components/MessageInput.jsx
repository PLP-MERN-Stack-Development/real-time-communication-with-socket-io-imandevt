import React, { useState } from 'react'

export default function MessageInput({ message = '', setMessage = () => {}, onSend, onTyping }) {
  const [input, setInput] = useState(message)

  const send = () => {
    if (!input.trim()) return
    onSend(input)
    setInput('')
    setMessage('')
  }

  return (
    <div className="p-3 md:p-4 border-t flex gap-2 items-center bg-white">
      <input
        className="flex-1 border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={() => onTyping()}
        placeholder="Type a message"
      />
      <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={send}>Send</button>
    </div>
  )
}
