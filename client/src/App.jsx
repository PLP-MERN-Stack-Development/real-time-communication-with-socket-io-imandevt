import React, { useState, useEffect } from "react"
import socket from "./socket/socket"

import Login from "./components/Login"
import OnlineUsers from "./components/OnlineUsers"
import ChatWindow from "./components/ChatWindow"
import MessageInput from "./components/MessageInput"


/*
  App.jsx - Core Chat Application
  Handles: auth, real-time messaging, rooms, typing, notifications
*/

export default function App() {
  const [username, setUsername] = useState("")
  const [loggedIn, setLoggedIn] = useState(false)
  const [messages, setMessages] = useState([])
  const [onlineUsers, setOnlineUsers] = useState([])
  const [typingUsers, setTypingUsers] = useState([])
  const [currentRoom, setCurrentRoom] = useState("global")
  const [isConnected, setIsConnected] = useState(true)

  useEffect(() => {
    // Connect socket on mount
    if (!socket.connected) {
      socket.connect()
    }

    socket.on("connect", () => {
      console.log("Connected to server")
      setIsConnected(true)
    })
    socket.on("disconnect", () => {
      console.log("Disconnected from server")
      setIsConnected(false)
    })

    socket.on("user_list", (users) => {
      console.log("Online users:", users)
      setOnlineUsers(users || [])
    })

    socket.on("receive_message", (msg) => {
      console.log("Received message:", msg)
      setMessages((prev) => [...prev, msg])
      if (Notification.permission === "granted" && document.hidden) {
        new Notification(`${msg.sender} says:`, { body: msg.message })
      }
      if (document.hidden) {
        try {
          new Audio("/notification.mp3").play()
        } catch (e) {
          console.log("Could not play sound")
        }
      }
    })

    socket.on("typing_users", (users) => {
      setTypingUsers(users.filter((u) => u !== username) || [])
    })

    socket.on("user_joined", ({ username: joinedUser }) => {
      setMessages((prev) => [
        ...prev,
        { 
          _id: `sys-${Date.now()}`,
          sender: "System",
          message: `${joinedUser} joined the chat`,
          timestamp: new Date(),
          type: "system"
        },
      ])
    })

    socket.on("user_left", ({ username: leftUser }) => {
      setMessages((prev) => [
        ...prev,
        { 
          _id: `sys-${Date.now()}`,
          sender: "System",
          message: `${leftUser} left the chat`,
          timestamp: new Date(),
          type: "system"
        },
      ])
    })

    return () => {
      socket.off("connect")
      socket.off("disconnect")
      socket.off("user_list")
      socket.off("receive_message")
      socket.off("typing_users")
      socket.off("user_joined")
      socket.off("user_left")
    }
  }, [username])

  const handleLogin = (name) => {
    setUsername(name)
    setLoggedIn(true)
    // Ensure socket is connected before emitting
    if (!socket.connected) {
      socket.connect()
    }
    socket.emit("user_join", name)
    fetchMessages("global")
  }

  const fetchMessages = async (room) => {
    try {
      const res = await fetch(`http://localhost:5000/api/messages?room=${room}&page=1`)
      const data = await res.json()
      setMessages(data || [])
    } catch (err) {
      console.error("Failed to fetch messages:", err)
    }
  }

  const handleSendMessage = (text) => {
    if (!text.trim()) return
    socket.emit("send_message", { message: text, room: currentRoom })
  }

  const handleTyping = () => {
    socket.emit("typing", true)
    setTimeout(() => socket.emit("typing", false), 1000)
  }

  const handleSwitchRoom = (room) => {
    setCurrentRoom(room)
    socket.emit("switch_room", room)
    fetchMessages(room)
  }

  if (!loggedIn) return <Login onLogin={handleLogin} />

  return (
    <div className="app-root flex flex-col h-screen bg-gray-50">
      <div className="bg-blue-600 text-white p-4 shadow">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">Chat Room</h1>
          <div className="text-sm">
            {isConnected ? (
              <span className="text-green-200">● Connected</span>
            ) : (
              <span className="text-red-200">● Disconnected</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden max-w-7xl w-full mx-auto">
        <OnlineUsers
          onlineUsers={onlineUsers}
          typingUser={typingUsers[0] || ""}
          currentUser={username}
        />

        <div className="flex-1 flex flex-col border-l">
          <div className="p-3 border-b bg-white flex gap-2 flex-wrap">
            {["global", "tech", "random"].map((room) => (
              <button
                key={room}
                onClick={() => handleSwitchRoom(room)}
                className={`px-4 py-2 rounded font-semibold transition ${
                  currentRoom === room
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                #{room}
              </button>
            ))}
          </div>

          <ChatWindow messages={messages} />

          <MessageInput
            onSend={handleSendMessage}
            onTyping={handleTyping}
          />
        </div>
      </div>
    </div>
  )
}
