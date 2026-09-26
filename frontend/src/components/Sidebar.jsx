import { NavLink, useNavigate } from "react-router-dom";
//used Navlink to allow navigation between react pages without reloading entire browser page.
import { useState } from "react";
import "./Sidebar.css";
import {
    FaHome,
    FaCompass,
    FaExchangeAlt,
    FaUser,
    FaSignInAlt,
    FaSignOutAlt
} from "react-icons/fa";

function Sidebar() {
    const navigate = useNavigate();
    const [showLogin, setShowLogin] = useState(false);

    const isLoggedIn = localStorage.getItem("token");
    //check authentication before allows access to protected pages
    const handleProtectedClick = (path) => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate(path);
        }
        else {
            setShowLogin(true);
        }
    }

    return (
        <>
            <aside className="sidebar">
                <div className="sidebar-logo">
                    <div className="logo-mark">S</div>

                    <div>
                        <h2>SkillSwap</h2>
                        <p>Learn • Teach • Grow</p>
                    </div>

                </div>

                <nav className="sidebar-nav">

                    <NavLink to="/" className={({ isActive }) =>
                        isActive ? "side-link active" : "side-link"}>
                        <FaHome className="side-icon" />
                        Home
                    </NavLink>

                    <button className="side-link side-button"
                        onClick={() => handleProtectedClick("/explore")}>
                        <FaCompass className="side-icon" />
                        Explore
                    </button>

                    <button className="side-link side-button"
                        onClick={() => handleProtectedClick("/requests")}>
                        <FaExchangeAlt className="side-icon" />
                        Requests
                    </button>

                    <button className="side-link side-button"
                        onClick={() => handleProtectedClick("/profile")}>
                        <FaUser className="side-icon" />
                        My profile
                    </button>

                </nav>

                <div className="sidebar-bottom">
                    {/*here we used conditional rendering with ternary operator */}
                    {isLoggedIn ? (
                        <button
                            className="logout-button"
                            onClick={() => {
                                localStorage.removeItem("token");
                                navigate("/");
                                window.location.reload();
                            }}>
                            <FaSignOutAlt className="side-icon" />
                            Logout
                        </button>
                    ) : (   
                        <button
                            className="popup-login"
                            onClick={() => {
                                setShowLogin(false);
                                navigate("/login", {
                                    state: { from: "/explore" }
                                });
                            }}>
                            <FaSignInAlt className="side-icon" />
                            Login
                        </button>
                    )}
                </div>

            </aside>

            {showLogin && (
                <div
                    className="login-overlay"
                    onClick={() => setShowLogin(false)}>

                    <div className="login-popup"
                        onClick={(e) => e.stopPropagation()}>

                        <button className="close-popup"
                            onClick={() => setShowLogin(false)}>
                            ×
                        </button>

                        <h2>Login Required</h2>

                        <p>
                            Please login to explore skills and connect
                            with other users.
                        </p>

                        <button
                            className="popup-login"
                            onClick={() => navigate("/login")}>
                            Login
                        </button>

                        <button
                            className="popup-register"
                            onClick={() => navigate("/register")}>
                            New user? Register
                        </button>

                    </div>

                </div>
            )}
        </>
    )
}
export default Sidebar;