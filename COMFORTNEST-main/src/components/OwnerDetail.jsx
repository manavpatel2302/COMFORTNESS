import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PropertyCard from "./PropertyCard";

const OwnerDetail = () => {
  const { id } = useParams(); // Using propertyId as id
  const navigate = useNavigate();
  const [owner, setOwner] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOwnerDetails = async () => {
      try {
        setLoading(true);
        // console.log("Fetching property details for propertyId:", id);
        const response = await fetch(`http://localhost:5000/user/property/${id}`);
        if (!response.ok) throw new Error("Owner details not found");
        const data = await response.json();
        // console.log("Property data received:", data);
        if (!data.owner || !data.owner.userId) {
          throw new Error("Owner data not found in property");
        }
        const ownerId = data.owner.userId;
        // console.log("Owner userId extracted:", ownerId);

        const ownerResponse = await fetch(`http://localhost:5000/user/fetch/${ownerId}`, {
          withCredentials: true,
        });
        if (!ownerResponse.ok) throw new Error("Owner details not found");
        const ownerData = await ownerResponse.json();
        // console.log("Owner data received:", ownerData);
        setOwner(ownerData);

        // console.log("Fetching properties for ownerId:", ownerId);
        const propertiesResponse = await fetch(`http://localhost:5000/user/property/owner/${ownerId}`, {
          withCredentials: true,
        });
        if (!propertiesResponse.ok) throw new Error("Properties not found");
        const propertiesData = await propertiesResponse.json();
        // console.log("Properties data received:", propertiesData);
        setProperties(propertiesData);
      } catch (err) {
        console.error("Error fetching details:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOwnerDetails();
  }, [id]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;
  if (!owner) return <div className="text-center mt-10">Owner not found</div>;

  return (
    <div className="container mx-auto py-20 max-w-4xl">
      {/* Navbar remains unchanged, managed by App.jsx */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        {/* Top Section: Profile and Basic Info */}
        <div className="flex items-center space-x-6 mb-6">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-gray-500">Profile</span>
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-700"><strong>Username:</strong> {owner.username || "N/A"}</p>
            <p className="text-gray-600"><strong>Email:</strong> {owner.email || "N/A"}</p>
            <p className="text-gray-600"><strong>Mobile:</strong> {owner.mobileNumber || "N/A"}</p>
          </div>
        </div>

        {/* Additional Details */}
        <div className="mt-6 space-y-4">
          <p className="text-gray-600"><strong>Joined:</strong> {new Date(owner.createdAt).toLocaleDateString() || "N/A"}</p>
          <p className="text-gray-600"><strong>Total Property Views:</strong> {owner.totalViews || 0}</p>
          <p className="text-gray-600"><strong>Total Properties:</strong> {owner.totalProperties || 0}</p>
        </div>
      </div>

      {/* Bottom Section: Listed Properties */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold text-[#27ae60] mb-5">Listed Properties</h2>
        {/* <div className="bg-white p-6 rounded-lg shadow-md h-64"> */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.map((property) => (
                        <div key={property._id} className="relative">
                            <PropertyCard property={property} />
                        </div>
                    ))}
          </div>
        {/* </div> */}
      </div>
    </div>
  );
};

export default OwnerDetail;