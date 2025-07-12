import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropertyCard from "./PropertyCard"; // Adjust the import path as needed

const MyPropertiesPage = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await fetch("http://localhost:5000/user/my-properties", {
                    method: "GET",
                    credentials: "include",
                });
                if (response.ok) {
                    const data = await response.json();
                    setProperties(data);
                } else {
                    console.error("Failed to fetch my properties:", await response.json());
                }
            } catch (error) {
                console.error("Error fetching my properties:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProperties();
    }, []);

    const handleEdit = (propertyId) => {
        navigate(`/edit-property/${propertyId}`);
    };
    const handleDelete = async (propertyId) => {
        if (window.confirm("Are you sure you want to delete this property?")) {
            try {
                const response = await fetch(`http://localhost:5000/user/property/${propertyId}`, {
                    method: "DELETE",
                    credentials: "include",
                });
                const text = await response.text(); // Get raw response as text
                let data;
                try {
                    data = JSON.parse(text); // Attempt to parse as JSON
                } catch (e) {
                    console.error("Failed to parse response as JSON:", text);
                    throw new Error("Server returned invalid JSON");
                }
                if (response.ok) {
                    setProperties(properties.filter((p) => p._id !== propertyId));
                    alert("Property deleted successfully!");
                } else {
                    console.error("Delete failed:", data);
                    alert(`Failed to delete property: ${data.message || "Unknown error"}`);
                }
            } catch (error) {
                console.error("Error deleting property:", error);
                alert("An error occurred while deleting.");
            }
        }
    };

    if (loading) return <div className="text-center mt-10">Loading...</div>;

    return (
        <div className="container mx-auto py-20">
            <h1 className="text-3xl font-bold mb-6 text-center">My Properties</h1>
            {properties.length === 0 ? (
                <p className="text-center">No properties found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.map((property) => (
                        <div key={property._id} className="relative">
                            <PropertyCard property={property} />
                            <div className="mt-2 flex justify-center space-x-2">
                                <button
                                    onClick={() => handleEdit(property._id)}
                                    className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(property._id)}
                                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyPropertiesPage;