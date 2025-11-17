import React, { useRef, useEffect } from 'react'

export default function ChatWindow({ messages = [] }) {
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-400">
          <p>No messages yet. Start the conversation!</p>
        </div>
      ) : (
        messages.map((msg, idx) => (
          <div key={msg._id || idx} className="flex gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <strong className="text-blue-600">{msg.sender}</strong>
                <span className="text-xs text-gray-500">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </div>
              {msg.type === 'system' ? (
                <p className="text-sm text-gray-500 italic">{msg.message}</p>
              ) : (
                <p className="text-gray-800">{msg.message}</p>
              )}
            </div>
          </div>
        ))
      )}
      <div ref={endRef} />
    </div>
  )
}
