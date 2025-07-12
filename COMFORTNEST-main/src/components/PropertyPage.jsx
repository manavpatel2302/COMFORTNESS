import React, { useState, useEffect } from "react";
import PropertyCard from "./PropertyCard";

const PropertyPage = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await fetch("http://localhost:5000/user/properties");
                if (!response.ok) {
                    throw new Error("Failed to fetch properties");
                }
                const data = await response.json();
                setProperties(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching properties:", error);
                setError(error.message);
                setLoading(false);
            }
        };
        fetchProperties();
    }, []);

    if (loading) return <p className="text-center text-gray-500">Loading properties...</p>;
    if (error) return <p className="text-center text-red-500">Error: {error}</p>;
    if (properties.length === 0) return <p className="text-center text-gray-500">No properties available.</p>;
   
    // Group properties into rows of 4
    const rows = [];
    for (let i = 0; i < properties.length; i += 4) {
        rows.push(properties.slice(i, i + 4));
    }

    return (
        <div className="container mx-auto py-20 max-w-7xl px-4 md:px-6 lg:px-8">
            <div className="flex flex-col gap-6 mt-5">
                {rows.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex flex-row gap-8">
                        {row.map((property) => (
                            <PropertyCard key={property._id} property={property} />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PropertyPage;