// src/components/ShortlistedPropertiesPage.jsx
import React, { useState, useEffect } from "react";
import PropertyCard from "./PropertyCard"; // Adjust the import path as needed

const ShortlistedPropertiesPage = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await fetch("http://localhost:5000/user/shortlisted-properties", {
                    method: "GET",
                    credentials: "include",
                });
                if (response.ok) {
                    const data = await response.json();
                    setProperties(data);
                } else {
                    console.error("Failed to fetch shortlisted properties:", await response.json());
                }
            } catch (error) {
                console.error("Error fetching shortlisted properties:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProperties();
    }, []);

    if (loading) return <div className="text-center mt-10">Loading...</div>;

    return (
        <div className="container mx-auto py-20">
            <h1 className="text-3xl font-bold mb-6 text-center">Shortlisted Properties</h1>
            {properties.length === 0 ? (
                <p className="text-center">No shortlisted properties found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.map((property) => (
                        <PropertyCard key={property._id} property={property} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ShortlistedPropertiesPage;