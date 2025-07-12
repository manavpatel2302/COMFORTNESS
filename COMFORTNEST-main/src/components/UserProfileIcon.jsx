import React, { useState, useEffect } from "react";
import UserProfileCard from "./UserProfileCard"; // Assume this will be created in Step 4

const UserProfileIcon = ({ onLogoutSuccess }) => {
    const [isCardOpen, setIsCardOpen] = useState(false);
    const [userInitial, setUserInitial] = useState("?"); // Fallback initial
    const [loading, setLoading] = useState(true); // Loading state for fetch

    // Fetch user data from /user/dashboard
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch("http://localhost:5000/user/dashboard", {
                    method: "GET",
                    credentials: "include", // Include cookies (JWT)
                });
                if (response.ok) {
                    const data = await response.json();
                    if (data.user && data.user.username) {
                        setUserInitial(data.user.username.charAt(0).toUpperCase()); // Set first letter
                    }
                } else {
                    console.warn("Failed to fetch user data:", response.status);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, []); // Run once on mount

    return (
        <>
            {/* Round Icon */}
            <div
                className="w-10 h-10 rounded-full bg-[#27ae60] text-white flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
                onClick={() => setIsCardOpen(!isCardOpen)}
                aria-label="Toggle user profile"
                title="User Profile"
            >
                {loading ? "?" : userInitial} {/* Show fallback while loading */}
            </div>

            {/* Render the Card when open */}
            <UserProfileCard isOpen={isCardOpen} onClose={() => setIsCardOpen(false)} onLogoutSuccess={onLogoutSuccess}/>
        </>
    );
};

export default UserProfileIcon;