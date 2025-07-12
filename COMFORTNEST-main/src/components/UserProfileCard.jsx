import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UserProfileCard = ({ isOpen, onClose, onLogoutSuccess }) => {
    const [user, setUser] = useState(null); // Store fetched user data
    const navigate = useNavigate();

    // Fetch user data when the card opens
    useEffect(() => {
        let isMounted = true;

        if (isOpen) {
            const fetchUserData = async () => {
                try {
                    const response = await fetch("http://localhost:5000/user/dashboard", {
                        method: "GET",
                        credentials: "include", // Include JWT cookie
                    });
                    if (response.ok && isMounted) {
                        const data = await response.json();
                        setUser(data.user || {});
                    } else {
                        console.warn("Failed to fetch user data:", response.status);
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            };
            fetchUserData();
        }

        return () => {
            isMounted = false; // Cleanup to prevent state updates on unmount
        };
    }, [isOpen]);

    // Handle outside click to close
    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (isOpen && !e.target.closest(".profile-card")) {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener("mousedown", handleOutsideClick);
        }
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [isOpen, onClose]);

    const handleLogout = async () => {
        try {
            const response = await fetch("http://localhost:5000/user/logout", {
                method: "POST",
                credentials: "include",
            });
            if (response.ok) {
                onLogoutSuccess(); // Update parent state and redirect
            } else {
                console.error("Logout failed:", await response.json());
            }
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed top-0 right-0 w-64 h-full bg-white shadow-lg p-4 transform transition-transform duration-300 ease-in-out profile-card"
            style={{ transform: isOpen ? "translateX(0)" : "translateX(100%)" }}
        >
            <button
                onClick={onClose}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                aria-label="Close profile card"
            >
                ×
            </button>
            {user ? (
                <>
                    <div className="mb-4 text-center">
                        <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center mx-auto mb-2">
                            {user.username ? user.username.charAt(0).toUpperCase() : "?"}
                        </div>
                        <h3 className="font-bold">{user.username || "Guest"}</h3>
                        <p className="text-sm text-gray-600">{user.email || "No email"}</p>
                    </div>
                    <button
                        onClick={() => {
                            navigate("/user/profile");
                            onClose();
                        }}
                        className="w-full py-2 mb-2 bg-gray-200 rounded hover:bg-gray-300"
                    >
                        Profile
                    </button>
                    <button
                        onClick={() => {
                            // Navigate based on role
                            if (user.role === "owner") {
                                navigate("/user/my-properties");
                            } else {
                                navigate("/user/shortlisted-properties");
                            }
                            onClose();
                        }}
                        className="w-full py-2 mb-2 bg-gray-200 rounded hover:bg-gray-300"
                    >
                        {user.role === "owner" ? "My Properties" : "Shortlisted Properties"}
                    </button>
                    {user.role === "owner" && (
                        <button
                            onClick={() => {
                                navigate("/user/shortlisted-properties");
                                onClose();
                            }}
                            className="w-full py-2 mb-2 bg-gray-200 rounded hover:bg-gray-300"
                        >
                            Shortlisted Properties
                        </button>
                    )}
                    <button
                        onClick={() => {
                            // Navigate to Settings page (to be defined)
                            console.log("Settings clicked");
                            onClose();
                        }}
                        className="w-full py-2 mb-2 bg-gray-200 rounded hover:bg-gray-300"
                    >
                        Settings
                    </button>
                    <button
                        onClick={handleLogout}
                        className="w-full py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        Logout
                    </button>
                </>
            ) : (
                <p className="text-center">Loading user data...</p>
            )}
        </div>
    );
};

export default UserProfileCard;