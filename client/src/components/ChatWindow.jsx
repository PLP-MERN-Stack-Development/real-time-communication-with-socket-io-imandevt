import React, { useRef, useEffect } from 'react'

export default function ChatWindow({ messages = [] }) {
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="w-full md:w-3/4 flex-1 flex flex-col p-3 md:p-4 overflow-auto bg-white">
      <div className="flex-1 space-y-2">
        {messages.map((msg, idx) => (
          <div key={msg._id || idx} className="mb-2 p-2 rounded-md bg-slate-50">
            <div className="text-sm text-gray-600">
              <strong className="text-gray-800">{msg.sender}</strong>{' '}
              <span className="text-gray-500">[{new Date(msg.timestamp).toLocaleTimeString()}]</span>
            </div>
            <div className="mt-1 text-gray-900">{msg.message}</div>
          </div>
        ))}
        <div ref={endRef} />
      </div>
    </div>
  )
}
