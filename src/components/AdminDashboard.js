import { NavLink , Outlet, useNavigate } from "react-router-dom";

export default function AdminDashboard(){
  const navigate = useNavigate();
  const currentAdmin = JSON.parse(localStorage.getItem("adminData"));
  function logout(){
    localStorage.clear();
    navigate("/adminLogin");
  }
  return(
  <>
  <aside>
    <h2>Dashboard</h2>
    <i className="fa-solid fa-gauge"></i>
    <ul>
      <li>
        <NavLink className="rad-6" to="adminOverview">
          <i className="fa-solid fa-chart-bar"></i>
          <span>Overview</span>
        </NavLink>
      </li>
      <li>
        <NavLink className="rad-6" to="adminManagement">
          <i className="fa-solid fa-gear"></i>
          <span>Village Management</span>
        </NavLink>
      </li>
      <li>
        <NavLink className="rad-6" to="adminChat">
          <i className="fa-brands fa-rocketchat"></i>
          <span>Chat</span>
        </NavLink>
      </li>
      <li>
        <NavLink className="rad-6" to="adminGallery">
          <i className="fa-solid fa-image"></i>
          <span>Gallery</span>
        </NavLink>
      </li>
    </ul>
    <div id="logout">
      <img src={currentAdmin.adminImage} alt=""/>
      <span>{currentAdmin.adminName}</span>
      <button onClick={logout}>Logout</button>
    </div>
  </aside>
  <Outlet/>
  </>
  );
}