import React, { useState, useEffect, useRef } from "react";

export default function AdminChat() {
  const [users, setUsers] = useState([]); // List of users
  const [selectedUser, setSelectedUser] = useState(null); // Selected user for chat
  const [messages, setMessages] = useState([]); // Chat messages
  const [messageInput, setMessageInput] = useState(""); // Input for new message
  const [searchTerm, setSearchTerm] = useState(""); // Search term for filtering users
  const ws = useRef(null); // WebSocket connection

  // Default users
  const defaultUsers = [
    {
      userName: "User1",
      userImage: "../imgs/user1.png",
    },
    {
      userName: "User2",
      userImage: "../imgs/user2.png",
    },
    {
      userName: "User3",
      userImage: "../imgs/user3.png",
    },
  ];

  // Fetch users from the server
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
              query {
                users {
                  userName
                  userImage
                }
              }
            `,
          }),
        });

        const result = await response.json();
        console.log("Fetched users:", result.data.users); // Debugging log
        if (result.data && result.data.users) {
          setUsers(result.data.users);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Handle user selection
  const handleUserClick = (user) => {
    console.log("Selected user:", user); // Debugging log
    setSelectedUser(user);
    setMessages([]); // Clear previous messages
    connectWebSocket(user.userName); // Establish WebSocket connection
  };

  // Establish WebSocket connection
  const connectWebSocket = (userName) => {
    if (ws.current) {
      ws.current.close(); // Close existing connection
    }

    ws.current = new WebSocket(`ws://localhost:5000/chat?user=${userName}`);

    ws.current.onopen = () => {
      console.log("WebSocket connection established");
    };

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("Received message:", message); // Debugging log
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    ws.current.onclose = () => {
      console.log("WebSocket connection closed");
    };
  };

  // Send message
  const sendMessage = () => {
    if (messageInput.trim() && ws.current) {
      const message = {
        sender: "admin",
        receiver: selectedUser.userName,
        text: messageInput,
      };

      ws.current.send(JSON.stringify(message));
      setMessages((prevMessages) => [...prevMessages, message]);
      setMessageInput("");
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  // Use default users if no users are available
  const usersToDisplay = users.length > 0 ? users : defaultUsers;

  // Filter users based on search term
  const filteredUsers = usersToDisplay.filter((user) =>
    user.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div id="content">
      <h1 style={{ fontSize: "24px", marginBottom: "10px" }}>Chat With Users</h1>
      <div id="page-content">
        <input
          className="rad-6"
          type="search"
          name="Search User"
          id="search-user"
          placeholder="Search for a user..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div id="search-results">
          <h3>Available Users</h3>
          <div id="users-list">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div
                  key={user.userName}
                  onClick={() => handleUserClick(user)}
                  style={{ cursor: "pointer", marginBottom: "10px" }}
                >
                  <img
                    src={user.userImage}
                    alt={user.userName}
                    style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                  />
                  <p>{user.userName}</p>
                </div>
              ))
            ) : (
              <p>No users found.</p>
            )}
          </div>
        </div>
        <div id="chat-content">
          <h3>
            Chat with: <span>{selectedUser ? selectedUser.userName : "None"}</span>
          </h3>
          <div id="conversation">
            {messages.map((message, index) => (
              <p
                key={index}
                className={message.sender === "admin" ? "admin" : "user"}
              >
                <span>{message.sender}:</span> <span>{message.text}</span>
              </p>
            ))}
          </div>
          <div id="sending">
            <textarea
              name="Message"
              id="message"
              placeholder="Type your message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}