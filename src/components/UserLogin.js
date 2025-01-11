import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
export default function UserLogin() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [userPassword, setUserPassword] = useState("");

  async function userSumition(event) {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            query LoginUser($userName: String!, $userPassword: String!) {
              loginUser(userName: $userName, userPassword: $userPassword) {
                image
                token
                message
              }
            }
          `,
          variables: {
            userName,
            userPassword,
          },
        }),
      });

      const result = await response.json();
      const data = result.data.loginUser;

      if (data.image && data.token) {
        localStorage.setItem(
          "userData",
          JSON.stringify({
            userImage: data.image,
            userName,
            token: data.token,
          })
        );
        navigate("/userDashboard/userOverview");
      } else if (data.message) {
        alert(data.message);
        setUserPassword(""); // Clear the password field
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  }
  return (
    <div id="login" className="rad-6">
      <Link className="back" to="/">
        <i className="fa-solid fa-arrow-left"></i>
      </Link>
      <h3>User Login</h3>
      <form action="">
        <div className="username">
          <label htmlFor="username">User Name</label>
          <input
            type="text"
            name="username"
            id="username"
            placeholder="Enter your user name"
            className="rad-6"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>
        <div className="password">
          <label htmlFor="password">Password</label>
          <input
            type="text"
            name="password"
            id="password"
            placeholder="Enter your password"
            className="rad-6"
            value={userPassword}
            onChange={(e) => setUserPassword(e.target.value)}
          />
        </div>
        <input
          onClick={userSumition}
          id="userLogin"
          type="submit"
          value="Login"
          className="rad-6"
        />
      </form>
      <div className="gray-text">
        Don't have an account <Link to="/userSignup">Sign Up</Link>
      </div>
    </div>
  );
}
