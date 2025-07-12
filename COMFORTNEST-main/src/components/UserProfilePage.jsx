import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UserProfilePage = () => {
    const [user, setUser] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({ username: "", email: "" });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch("http://localhost:5000/user/dashboard", {
                    method: "GET",
                    credentials: "include",
                });
                if (response.ok) {
                    const data = await response.json();
                    const userData = data.user || data;
                    setUser(userData);
                    setFormData({
                        username: userData.username || "",
                        email: userData.email || "",
                    });
                } else {
                    console.warn("Failed to fetch user data:", response.status);
                    navigate("/");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                navigate("/");
            }
        };
        fetchUserData();
    }, [navigate]);

    const handleEdit = () => {
        setEditMode(true);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            console.log("Sending update with:", formData);
            const response = await fetch("http://localhost:5000/user/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(formData),
            });
            console.log("Response status:", response.status);
            const text = await response.text();
            console.log("Raw response text:", text);
            let data;
            try {
                data = JSON.parse(text);
            } catch (e) {
                console.error("Response is not valid JSON:", text);
                data = { message: "Server returned non-JSON response" };
            }
            console.log("Response data:", data);
            if (response.ok) {
                setUser(data.user || data);
                setEditMode(false);
                alert("Profile updated successfully!");
            } else {
                // Custom alert based on error message
                if (data.message === "Email already exists, try another one") {
                    alert(data.message);
                } else if (data.message === "User not found") {
                    alert("User not found. Please log in again.");
                } else if (data.message === "Username cannot be just spaces") {
                    alert(data.message);
                } else if (data.message === "Email cannot be just spaces") {
                    alert(data.message);
                } else if (data.message === "Username and email are required and cannot be empty or just spaces") {
                    alert(data.message);
                } else {
                    alert("Update failed due to an error. Please try again.");
                }
                console.error("Failed to update profile:", data.message || "Unknown error");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("An error occurred. Please try again.");
        }
    };

    if (!user) return <div className="text-center mt-10">Loading...</div>;

    return (
        <div className="container mx-auto py-20 mt-20"> 
            <h1 className="text-3xl font-bold mb-6 text-center">User Profile</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-1 text-center">
                    <div className="w-32 h-32 rounded-full bg-[#27ae60] flex items-center justify-center mx-auto mb-4 text-white text-4xl">
                        {user.username.charAt(0).toUpperCase()}
                    </div>
                    <h2 className="text-xl font-semibold">{user.username}</h2>
                </div>
                <div className="col-span-2">
                    {editMode ? (
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block mb-1">Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-[#27ae60] text-white rounded hover:bg-[#219653]"
                                >
                                    Save
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEditMode(false)}
                                    className="ml-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-4">
                            <p><strong>Email:</strong> {user.email}</p>
                            <button
                                onClick={handleEdit}
                                className="px-4 py-2 bg-[#27ae60] text-white rounded hover:bg-[#219653]"
                            >
                                Edit Profile
                            </button>
                        </div>
                    )}
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-2">Account Settings</h3>
                        <p className="text-gray-600">Placeholder for settings (e.g., password change).</p>
                    </div>
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-2">My Properties</h3>
                        <p className="text-gray-600">Placeholder for property list.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfilePage;