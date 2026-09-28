import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Sidebar.css";

import {
    FaHome,
    FaCompass,
    FaExchangeAlt,
    FaUser,
    FaSignInAlt,
    FaSignOutAlt,
    FaComment
} from "react-icons/fa";

function Sidebar() {

    const navigate = useNavigate();

    const [showLogin, setShowLogin] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [unreadRequestCount, setUnreadRequestCount] = useState(0);

    const isLoggedIn = localStorage.getItem("token");

    const checkNotifications = async () => {

        const token = localStorage.getItem("token");

        if (!token) {
            setUnreadCount(0);
            return;
        }

        try {

            const response = await fetch(
                "http://localhost:5000/api/messages/unread",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (response.ok) {
                setUnreadCount(data.count || 0);
            }

              const requestResponse = await fetch(
            "http://localhost:5000/api/requests/unread",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const requestData = await requestResponse.json();

        if (requestResponse.ok) {
            setUnreadRequestCount(
                requestData.count || 0
            );
        }

        } catch (error) {

            console.log(
                "Notification error:",
                error
            );

        }
    };

    useEffect(() => {

        if (!isLoggedIn) {
            setUnreadCount(0);
            setUnreadRequestCount(0);
            return;
        }

        checkNotifications();

        const interval = setInterval(() => {
            checkNotifications();
        }, 5000);

        return () => clearInterval(interval);

    }, [isLoggedIn]);


    const handleProtectedClick = (path) => {

        const token = localStorage.getItem("token");

        if (token) {
            navigate(path);
        } else {
            setShowLogin(true);
        }
    };


    return (
        <>

            <aside className="sidebar">

                {/* LOGO */}

                <div className="sidebar-logo">

                    <div className="logo-mark">
                        S
                    </div>

                    <div>

                        <h2>SkillSwap</h2>

                        <p>
                            Learn • Teach • Grow
                        </p>

                    </div>

                </div>


                {/* NAVIGATION */}

                <nav className="sidebar-nav">


                    {/* HOME */}

                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            isActive
                                ? "side-link active"
                                : "side-link"
                        }
                    >

                        <FaHome className="side-icon" />

                        Home

                    </NavLink>


                    {/* EXPLORE */}

                    <button
                        className="side-link side-button"
                        onClick={() =>
                            handleProtectedClick("/explore")
                        }
                    >

                        <FaCompass className="side-icon" />

                        Explore

                    </button>


                    {/* REQUESTS */}

            <button
    className="side-link side-button request-nav-button"
    onClick={() => handleProtectedClick("/requests")}
>
    <FaExchangeAlt className="side-icon" />

    <span>Requests</span>

    {unreadRequestCount > 0 && (
        <span className="notification-badge">
            {unreadRequestCount > 99 ? "99+" : unreadRequestCount}
        </span>
    )}
</button>


                    {/* MESSAGES */}

                    <button
                        className="side-link side-button message-nav-button"
                        onClick={() =>
                            handleProtectedClick("/messages")
                        }
                    >

                        <FaComment className="side-icon" />

                        <span>
                            Messages
                        </span>


                        {/* NOTIFICATION */}

                        {unreadCount > 0 && (

                            <span className="notification-badge">

                                {unreadCount > 99
                                    ? "99+"
                                    : unreadCount}

                            </span>

                        )}

                    </button>


                    {/* PROFILE */}

                    <button
                        className="side-link side-button"
                        onClick={() =>
                            handleProtectedClick("/profile")
                        }
                    >

                        <FaUser className="side-icon" />

                        My profile

                    </button>

                </nav>


                {/* BOTTOM */}

                <div className="sidebar-bottom">

                    {isLoggedIn ? (

                        <button
                            className="logout-button"
                            onClick={() => {

                                localStorage.removeItem(
                                    "token"
                                );

                                localStorage.removeItem(
                                    "user"
                                );

                                navigate("/");

                                window.location.reload();

                            }}
                        >

                            <FaSignOutAlt className="side-icon" />

                            Logout

                        </button>

                    ) : (

                        <button
                            className="popup-login"
                            onClick={() => {

                                setShowLogin(false);

                                navigate("/login", {
                                    state: {
                                        from: "/explore"
                                    }
                                });

                            }}
                        >

                            <FaSignInAlt className="side-icon" />

                            Login

                        </button>

                    )}

                </div>

            </aside>


            {/* LOGIN POPUP */}

            {showLogin && (

                <div
                    className="login-overlay"
                    onClick={() =>
                        setShowLogin(false)
                    }
                >

                    <div
                        className="login-popup"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <button
                            className="close-popup"
                            onClick={() =>
                                setShowLogin(false)
                            }
                        >
                            ×
                        </button>


                        <h2>
                            Login Required
                        </h2>


                        <p>
                            Please login to explore skills
                            and connect with other users.
                        </p>


                        <button
                            className="popup-login"
                            onClick={() =>
                                navigate("/login")
                            }
                        >
                            Login
                        </button>


                        <button
                            className="popup-register"
                            onClick={() =>
                                navigate("/register")
                            }
                        >
                            New user? Register
                        </button>

                    </div>

                </div>

            )}

        </>

    );
}

export default Sidebar;