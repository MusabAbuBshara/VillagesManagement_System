import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function UserSignup() {
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const query = `
      mutation UserSignup($userName: String!, $userFullName: String!, $userPassword: String!) {
        userSignup(userName: $userName, userFullName: $userFullName, userPassword: $userPassword)
      }
    `;

    const variables = {
      userName: username,
      userFullName: fullname,
      userPassword: password,
    };

    try {
      const response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, variables }),
      });

      const result = await response.json();

      if (result.errors) {
        setMessage(`Error: ${result.errors[0].message}`);
      } else if (result.data && result.data.userSignup) {
        setMessage("The user has been added successfully!");
      } else {
        setMessage("Error: Unable to add user.");
      }
    } catch (error) {
      setMessage("Error: Network issue or server unavailable.");
    }
  };

  return (
    <div id="sign-up" className="rad-6">
      <h3>User Sign Up</h3>
      <form onSubmit={handleSubmit}>
        <div className="fullname">
          <label htmlFor="fullname">Full Name</label>
          <input
            type="text"
            name="fullname"
            id="fullname"
            placeholder="Enter your full name"
            className="rad-6"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
          />
        </div>
        <div className="username">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            id="username"
            placeholder="Enter your username"
            className="rad-6"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="password">
          <label htmlFor="password">Password</label>
          <input
            type="password" // Changed to type="password" for security
            name="password"
            id="password"
            placeholder="Enter your password"
            className="rad-6"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <input type="submit" value="Sign Up" className="rad-6" />
      </form>
      <div className="gray-text">
        Already have an account <Link to="/userLogin">Login</Link>
      </div>
      {message && <p>{message}</p>}
    </div>
  );
}