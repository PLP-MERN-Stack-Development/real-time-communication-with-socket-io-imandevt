import React, { useState, useEffect } from "react";
import socket from "./socket/socket";
import Login from "./components/Login";
import OnlineUsers from "./components/OnlineUsers";
import ChatWindow from "./components/ChatWindow";
import MessageInput from "./components/MessageInput";

export default function App() {
  const [username, setUsername] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUser, setTypingUser] = useState("");
  const [currentRoom, setCurrentRoom] = useState("global");

  const fetchMessages = async (room) => {
    try {
      const res = await fetch(`http://localhost:5000/api/messages?room=${room}`);
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogin = async (name) => {
    setUsername(name);
    setLoggedIn(true);
    socket.emit("user_join", name);
    await fetchMessages(currentRoom);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      socket.emit("send_message", { message, room: currentRoom });
      setMessage("");
    }
  };

  const handleTyping = () => {
    socket.emit("typing", true);
    setTimeout(() => socket.emit("typing", false), 800);
  };

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    const reader = new FileReader();
    reader.onload = () => {
      socket.emit("send_file", {
        fileData: reader.result,
        fileName: selectedFile.name,
        room: currentRoom,
      });
    };
    reader.readAsDataURL(selectedFile);
  };

  useEffect(() => {
    socket.on("receive_message", (msg) => setMessages(prev => [...prev, msg]));
    socket.on("private_message", (msg) => setMessages(prev => [...prev, msg]));
    socket.on("room_messages", (msgs) => setMessages(msgs));
    socket.on("user_list", (users) => setOnlineUsers(users));
    socket.on("typing_users", (users) => setTypingUser(users.filter(u => u !== username)[0] || ""));

    return () => socket.off();
  }, [username]);

  return (
    <div className="app-root flex flex-col h-screen bg-slate-50 p-6 max-w-6xl mx-auto">
      {!loggedIn ? (
        <div className="flex items-center justify-center h-full">
          <Login onLogin={handleLogin} />
        </div>
      ) : (
        <div className="flex flex-1 border rounded-lg overflow-hidden shadow-lg bg-white">
          <OnlineUsers onlineUsers={onlineUsers} typingUser={typingUser} currentUser={username} />

          <div className="w-3/4 flex flex-col">
            <div className="p-3 border-b flex gap-3 bg-gray-100">
              {['global', 'room1', 'room2'].map(room => (
                <button
                  key={room}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${currentRoom === room ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-800 hover:bg-blue-400 hover:text-white'}`}
                  onClick={() => {
                    setCurrentRoom(room);
                    socket.emit("switch_room", room);
                    fetchMessages(room);
                  }}
                >
                  {room}
                </button>
              ))}
              <input type="file" onChange={handleFileUpload} className="ml-auto" />
            </div>

            <ChatWindow messages={messages} />
            <MessageInput message={message} setMessage={setMessage} onSend={handleSendMessage} onTyping={handleTyping} />
          </div>
        </div>
      )}
    </div>
  );
}