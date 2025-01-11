import "./App.css";
import AdminLogin from "./components/AdminLogin";
import Home from "./components/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserLogin from "./components/UserLogin";
import AdminSignup from "./components/AdminSignup";
import UserSignup from "./components/UserSignup";
import Overview from "./components/Overview";
import AdminDashboard from "./components/AdminDashboard";
import UserDashboard from "./components/UserDashboard";
import AdminGallery from "./components/AdminGallery"
import UserGallery from "./components/UserGallery";
import AdminManagement from "./components/AdminManagement";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/adminLogin" element={<AdminLogin />}></Route>
        <Route path="/userLogin" element={<UserLogin />}></Route>
        <Route path="/adminSignup" element={<AdminSignup />}></Route>
        <Route path="/userSignup" element={<UserSignup />}></Route>
        <Route path="/adminDashboard" element={<AdminDashboard />}>
          <Route path="adminOverview" element={<Overview />}></Route>
          <Route path="adminManagement" element={<AdminManagement />}></Route>
          <Route path="adminChat" element={<Overview />}></Route>
          <Route path="adminGallery" element={<AdminGallery />}></Route>
        </Route>
        <Route path="/userDashboard" element={<UserDashboard />}>
          <Route path="userOverview" element={<Overview />}></Route>
          <Route path="userManagement" element={<Overview />}></Route>
          <Route path="userChat" element={<Overview />}></Route>
          <Route path="userGallery" element={<UserGallery />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
