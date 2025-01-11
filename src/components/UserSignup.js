import { Link } from "react-router-dom";
export default function UserSignup(){
  return(
    <div id="sign-up" className="rad-6">
    <h3>User Sign Up</h3>
    <form action="">
      <div className="fullname">
        <label htmlFor="fullname">Full Name</label>
        <input type="text" name="fullname" id="fullname" placeholder="Enter your full name" className="rad-6"/>
      </div>
      <div className="username">
        <label htmlFor="username">Username</label>
        <input type="text" name="username" id="username" placeholder="Enter your username" className="rad-6"/>
      </div>
      <div className="password">
        <label htmlFor="password">Password</label>
        <input type="text" name="password" id="password" placeholder="Enter your password" className="rad-6"/>
      </div>
      <input type="submit" value="Sign Up" className="rad-6"/>
    </form>
    <div className="gray-text">Already have an account <Link to="/userLogin">Login</Link></div>
  </div>
  );
}