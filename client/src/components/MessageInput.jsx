import React, { useState } from 'react'

export default function MessageInput({ onSend, onTyping }) {
  const [input, setInput] = useState('')

  const send = () => {
    if (!input.trim()) return
    onSend(input)
    setInput('')
  }

  const handleKeyDown = (e) => {
    if (onTyping) onTyping()
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div className="p-3 md:p-4 border-t flex gap-2 items-center bg-white">
      <input
        className="flex-1 border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
      />
      <button 
        className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 font-semibold"
        onClick={send}
      >
        Send
      </button>
    </div>
  )
}
