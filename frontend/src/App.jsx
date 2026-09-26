import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Requests from "./pages/Requests";
import ProtectedRoute from "./pages/ProtectedRoute";

function App(){
  return(
    <BrowserRouter>

    <Sidebar/>

    <Routes>
      <Route path="/" element={<Home/>}/>

      <Route path="/explore" element={
        <ProtectedRoute>
          <Explore/>
        </ProtectedRoute>}/>

      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>

      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile/>
        </ProtectedRoute>}/>
        
      <Route path="/requests" element={
        <ProtectedRoute>
          <Requests/>
        </ProtectedRoute>}/>
    </Routes>

    </BrowserRouter>
  )
}
export default App;