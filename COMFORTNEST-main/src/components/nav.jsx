import React from 'react';
import { useState, useEffect } from "react";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import Login from './Login'; 
import Signup from './Signup';
import UserProfileIcon from './UserProfileIcon';

const Nav = () => {

    const [modal, setModal] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState("");
    const [role, setRole] = useState(null);

    const navigate = useNavigate();
    const location = useLocation(); // To track the current route

    const checkLoginStatus = async () => {
        try {
            const response = await fetch("http://localhost:5000/user/dashboard", {
                method: "GET",
                credentials: "include",
            });
            if (response.ok) {
                const data = await response.json();
                setIsLoggedIn(true);
                setUsername(data.user.username);
                setRole(data.role);
            } else {
                const errorData = await response.json();
                console.log("Dashboard error:", errorData.message);
                setIsLoggedIn(false);
                setUsername("");
                setRole(null);
            }
        } catch (error) {
            console.error("Check login error:", error);
            setIsLoggedIn(false);
            setRole(null);
        }
    };

    useEffect(() => {
        checkLoginStatus();
    }, []);

    const handleClose = (nextModal = null) => {
        setModal(nextModal);
    };

    const handleLogin = (username) => {
        setIsLoggedIn(true);
        setUsername(username);
        checkLoginStatus();
    };

    const handleLogoutSuccess = () => {
        // Callback to update state after logout
        console.log("logout clicked !!")
        setIsLoggedIn(false);
        setUsername("");
        setRole(null);
        checkLoginStatus();
        navigate("/");
    };

    const handleNavLinkClick = (section) => {
        navigate(`/?section=${section}`);
    };

    return(
        <div className="container">

            <div className='navbar shadow-md'>


                <div className="logo">
                    <img id="logo" src="/images/logo.jpg" alt="logo"></img>
                    <h3> COMFORTNEST </h3>
                </div>

                <ul>
                    <li>
                        <button onClick={() => handleNavLinkClick("home")} className="nav-link">
                            Home
                        </button>
                    </li>
                    {/* <li>
                        <button onClick={() => handleNavLinkClick("explore")} className="nav-link">
                            Explore
                        </button>
                    </li> */}
                    <li>
                        <RouterLink to="/properties" className="nav-link">
                            Property
                        </RouterLink>
                    </li>
                    <li>
                        <button onClick={() => handleNavLinkClick("package")} className="nav-link">
                            Subscription
                        </button>
                    </li>
                    <li>
                        <button className='nav-link' onClick={() => handleNavLinkClick("footer")}>
                            Contact Us
                        </button>
                    </li>
                </ul>

                <div className="btn1 flex items-center">
                    {isLoggedIn ? (
                        <>
                            {role === "owner" && (
                                <RouterLink
                                    to="/add-property"
                                    className="bg-[#27ae60] text-white px-4 py-2 rounded-md mr-2"
                                >
                                    Add Property
                                </RouterLink>
                            )}
                            <UserProfileIcon onLogoutSuccess={handleLogoutSuccess} /> 
                        </>
                    ) : (
                        <>
                            <button id="login_btn" onClick={() => setModal("login")} className="mr-2">
                                Login
                            </button>
                            <button id="signup_btn" onClick={() => setModal("signup")}>
                                Signup
                            </button>
                        </>
                    )}
                </div>                                                                                          

            </div>

            {/* Show Modal Based on State */}
            {modal === "login" && <Login onClose={handleClose} onLogin={handleLogin} />}
            {modal === "signup" && <Signup onClose={handleClose} />}


        </div>

    );
};

export default Nav;

