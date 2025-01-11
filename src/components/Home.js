import { Link } from "react-router-dom";
export default function Home(){
  return(
    <div id="login"  className="rad-6">
      <h3>Are you Admin Or User</h3>
      <Link to="/adminLogin" id="adminRole" className="blue-link rad-6">Admin</Link>
      <Link to="/userLogin" id="userRole" className="blue-link rad-6">User</Link>
    </div>
  );
}