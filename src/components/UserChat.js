import React, { useState, useEffect, useRef } from "react";

export default function UserChat() {
  const [admins, setAdmins] = useState([]); // List of admins
  const [selectedAdmin, setSelectedAdmin] = useState(null); // Selected admin for chat
  const [messages, setMessages] = useState([]); // Chat messages
  const [messageInput, setMessageInput] = useState(""); // Input for new message
  const [searchTerm, setSearchTerm] = useState(""); // Search term for filtering admins
  const ws = useRef(null); // WebSocket connection
  const currentUser = "user1"; // Replace with the current user's username (e.g., from authentication)

  // Default admins
  const defaultAdmins = [
    {
      userName: "musab",
      userImage: "../imgs/musab.jpg",
    },
    {
      userName: "walid",
      userImage: "../imgs/walid.jpg",
    },
    {
      userName: "maen",
      userImage: "../imgs/maen.png",
    },
  ];

  // Fetch admins from the server
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await fetch("http://localhost:5000/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
              query {
                users(role: "admin") {
                  userName
                  userImage
                }
              }
            `,
          }),
        });

        const result = await response.json();
        if (result.data && result.data.users) {
          setAdmins(result.data.users);
        }
      } catch (error) {
        console.error("Error fetching admins:", error);
      }
    };

    fetchAdmins();
  }, []);

  // Handle admin selection
  const handleAdminClick = (admin) => {
    setSelectedAdmin(admin);
    setMessages([]); // Clear previous messages
    connectWebSocket(currentUser, admin.userName); // Establish WebSocket connection
  };

  // Establish WebSocket connection
  const connectWebSocket = (userName, adminName) => {
    if (ws.current) {
      ws.current.close(); // Close existing connection
    }

    ws.current = new WebSocket(`ws://localhost:5000/chat?user=${userName}&admin=${adminName}`);

    ws.current.onopen = () => {
      console.log("WebSocket connection established");
    };

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    ws.current.onclose = () => {
      console.log("WebSocket connection closed");
    };
  };

  // Send message
  const sendMessage = () => {
    if (messageInput.trim() && ws.current && selectedAdmin) {
      const message = {
        sender: currentUser, // Use the current user's username
        receiver: selectedAdmin.userName, // Send to the selected admin
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

  // Filter admins based on search term
  const filteredAdmins = admins.filter((admin) =>
    admin.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log("Search Term:", searchTerm); // Debugging log
  console.log("Filtered Admins:", filteredAdmins); // Debugging log

  // Use default admins if no admins are available or no search results
  const adminsToDisplay = filteredAdmins.length > 0 ? filteredAdmins : defaultAdmins;

  console.log("Admins to Display:", adminsToDisplay); // Debugging log

  return (
    <div id="content">
      <h1 style={{ fontSize: "24px", marginBottom: "10px" }}>Chat With Admins</h1>
      <div id="page-content">
        <input
          className="rad-6"
          type="search"
          name="Search Admin"
          id="search-admin"
          placeholder="Search for an admin..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div id="search-results">
          <h3>Available Admins</h3>
          <div id="admins-list">
            {adminsToDisplay.map((admin) => (
              <div
                key={admin.userName}
                onClick={() => handleAdminClick(admin)}
                style={{ cursor: "pointer", marginBottom: "10px" }}
              >
                <img
                  src={admin.userImage}
                  alt={admin.userName}
                  style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                />
                <p>{admin.userName}</p>
              </div>
            ))}
          </div>
        </div>
        <div id="chat-content">
          <h3>
            Chat with: <span>{selectedAdmin ? selectedAdmin.userName : "None"}</span>
          </h3>
          <div id="conversation">
            {messages.map((message, index) => (
              <p
                key={index}
                className={message.sender === currentUser ? "user" : "admin"}
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