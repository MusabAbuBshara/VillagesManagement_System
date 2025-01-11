import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  async function adminSumition(event) {
    event.preventDefault();
    try {
      console.log("Sending request with:", { adminName, adminPassword });

      const response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            query LoginAdmin($adminName: String!, $adminPassword: String!) {
              loginAdmin(adminName: $adminName, adminPassword: $adminPassword) {
                image
                token
                message
              }
            }
          `,
          variables: {
            adminName,
            adminPassword,
          },
        }),
      });

      const result = await response.json();
      console.log("Server response:", result);

      if (result.errors) {
        console.error("GraphQL errors:", result.errors);
        alert(`Error: ${result.errors[0].message}`);
        return;
      }

      const data = result.data?.loginAdmin;

      if (data?.image && data?.token) {
        localStorage.setItem(
          "adminData",
          JSON.stringify({ adminImage: data.image, adminName, token: data.token })
        );
        navigate("/adminDashboard/adminOverview");
      } else if (data?.message === "Incorrect Name or Password") {
        alert(data.message);
        window.location.reload();
      } else {
        alert("Unexpected response from the server.");
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
      <h3>Admin Login</h3>
      <form onSubmit={adminSumition}>
        <div className="username">
          <label htmlFor="username">Admin Name</label>
          <input
            type="text"
            name="username"
            id="username"
            placeholder="Enter your admin name"
            className="rad-6"
            value={adminName}
            onChange={(e) => setAdminName(e.target.value)}
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
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
          />
        </div>
        <input type="submit" value="Login" className="rad-6" />
      </form>
      <div className="gray-text">
        Don't have an account <Link to="/adminSignup">Sign Up</Link>
      </div>
    </div>
  );
}