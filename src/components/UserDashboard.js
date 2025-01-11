import { NavLink , Outlet, useNavigate } from "react-router-dom";

export default function UserDashboard(){
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("userData"));
  function logout(){
    localStorage.clear();
    navigate("/userLogin");
  }
  return(
  <>
  <aside>
    <h2>Dashboard</h2>
    <i className="fa-solid fa-gauge"></i>
    <ul>
      <li>
        <NavLink className="rad-6" to="userOverview">
          <i className="fa-solid fa-chart-bar"></i>
          <span>Overview</span>
        </NavLink>
      </li>
      <li>
        <NavLink className="rad-6" to="userManagement">
          <i className="fa-solid fa-gear"></i>
          <span>Village Management</span>
        </NavLink>
      </li>
      <li>
        <NavLink className="rad-6" to="userChat">
          <i className="fa-brands fa-rocketchat"></i>
          <span>Chat</span>
        </NavLink>
      </li>
      <li>
        <NavLink className="rad-6" to="userGallery">
          <i className="fa-solid fa-image"></i>
          <span>Gallery</span>
        </NavLink>
      </li>
    </ul>
    <div id="logout">
      <img src={currentUser.userImage} alt=""/>
      <span>{currentUser.userName}</span>
      <button onClick={logout}>Logout</button>
    </div>
  </aside>
  <Outlet/>
  </>
  );
}