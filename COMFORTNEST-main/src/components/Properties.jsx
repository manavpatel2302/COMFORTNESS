import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import PropertyCard from "./PropertyCard"; // Import the PropertyCard component

const Properties = () => {
  console.log("Properties component loaded"); // Debug component load
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Fetching properties for category:", category); // Debug start
    const fetchProperties = async () => {
      if (category) {
        try {
          setLoading(true);
          const response = await fetch(
            `http://localhost:5000/user/property/type?category=${category}`, {
              credentials: "include", // Include cookies for auth
            }
          );
          console.log("Response status:", response.status); // Debug status
          if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
          const data = await response.json();
          console.log("Fetched properties data:", data);
          setProperties(Array.isArray(data) ? data : []);
        } catch (err) {
          console.error("Error fetching properties:", err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      } else {
        setProperties([]);
        setLoading(false);
      }
    };
    fetchProperties();
  }, [category]); // Re-run when category changes

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="property">
      <div className="property_content mx-auto px-4 mt-20">
        <div className="info">
          <h2 className="text-3xl font-bold text-gray-800 bg-white p-4">
            {category ? `${category.replace(/([A-Z])/g, " $1").trim()} Properties` : "All Properties"}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 ml-0 justify-start">
          {properties.length > 0 ? (
            properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))
          ) : (
            <p className="text-center text-gray-600">No properties found.</p>
          )}
        </div>
        <button
          onClick={() => navigate("/properties")}
          className="mt-6 p-2 bg-[#27ae60] text-white rounded-lg hover:bg-green-700 transition duration-200 ml-0"
        >
          Back to All Types
        </button>
      </div>
    </div>
  );
};

export default Properties;