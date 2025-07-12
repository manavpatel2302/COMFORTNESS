import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const PropertyDetails = () => {
    const { id } = useParams(); // Get the property ID from the URL
    const navigate = useNavigate();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [propertyError, setPropertyError] = useState(null); // New: Separate property error
    const [userError, setUserError] = useState(null); // New: Separate user error
    const [mainImage, setMainImage] = useState(null); // State for the main image
    const [currentUserId, setCurrentUserId] = useState(null);
    const [isShortlisted, setIsShortlisted] = useState(false);

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:5000/user/property/${id}`);
                // console.log("Fetched property data:", response);
                if (!response.ok) {
                    throw new Error(`Failed to fetch property: ${response.status} ${response.statusText}`);
                }
                const data = await response.json();
                // console.log("Fetched property data:", data);
                setProperty(data);
                setMainImage(data.profileImage);
            } catch (err) {
                setPropertyError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProperty();
    }, [id]);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await fetch("http://localhost:5000/user/dashboard", {
                    method: "GET",
                    credentials: "include",
                });
                if (response.ok) {
                    const data = await response.json();
                    // console.log("Fetched user data:", data);
                    setCurrentUserId(data.user._id); // Ensure this matches your backend response
                    const user = await fetch("http://localhost:5000/user/shortlisted-properties", {
                        method: "GET",
                        credentials: "include",
                    });
                    if (user.ok) {
                        const shortlisted = await user.json();
                        setIsShortlisted(shortlisted.some((p) => p._id === id));
                    }
                } else {
                    console.log("Dashboard fetch failed:", response.status, await response.text());
                }
            } catch (err) {
                console.error("Error fetching user data:", err);
                setUserError(err.message);
            }
        };
        fetchCurrentUser();
    }, [id]); // Runs once on mount

    if (loading) {
        return <div className="text-center mt-20">Loading...</div>;
    }

    if (propertyError) {
        return <div className="text-center mt-10 text-red-500">{propertyError}</div>;
    }

    if (!property) {
        return <div className="text-center mt-10">Property not found</div>;
    }

    if (userError) {
        console.log("User error (non-critical):", userError); // Log but don’t block render
    }

    const { profileImage, propertyName, location, category, status, price, moreImages, description, area, owner } = property;

    // Format the price with Rupee symbol
    const formattedPrice = status === "rent"
        ? `₹${price.rentPrice}/month`
        : `₹${price.salePriceRange.min} - ₹${price.salePriceRange.max} Lakhs`;

    // Handle thumbnail click to update main image
    const handleThumbnailClick = (image) => {
        setMainImage(image);
    };

    const handleEdit = () => {
        navigate(`/edit-property/${id}`);
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this property?")) {
            try {
                const response = await fetch(`http://localhost:5000/user/property/${id}`, {
                    method: "DELETE",
                    credentials: "include",
                });
                const data = await response.json();
                if (response.ok) {
                    setPropertyError("Property deleted successfully!"); // Use error state to show message
                    setTimeout(() => navigate("/properties"), 1000); // Redirect to properties list
                } else {
                    setPropertyError(data.message || "Failed to delete property");
                }
            } catch (error) {
                console.error("Error deleting property:", error);
                setPropertyError("Error deleting property");
            }
        }
    };

    // Check if the current user is the owner
    const isOwner = currentUserId && owner.userId === currentUserId;

    const handleShortlist = async () => {
        try {
            const response = await fetch(`http://localhost:5000/user/shortlist-property/${id}`, {
                method: "POST",
                credentials: "include",
            }); 
            const data = await response.json();
            console.log("Server response:", data);
            console.log(data.message);
            if (response.ok) {
                setIsShortlisted(!isShortlisted); // Toggle shortlist status
                alert(data.message);
            }
        } catch (error) {
            console.error("Error shortlisting property:", error);
            alert("Failed to update shortlist.");
        }
    };

    const handleViewProperty = (propertyId) => {
        navigate(`/property/${id}/ownerdetails`)
    };

    return (
        <div className="container mx-auto py-20 max-w-7xl">
            {/* Header Section */}
            <div className="flex justify-between items-center mt-5 mb-6">
                <button
                    onClick={() => navigate('/properties')}
                    className="text-gray-600 hover:text-gray-800 flex items-center"
                >
                    <span className="mr-2">  </span> Back
                </button>
                <h2 className="text-3xl font-semibold text-[#27ae60]">{propertyName}</h2>
                <span
                    className={`px-3 py-1 text-sm font-semibold text-white rounded ${
                        status === "rent" ? "bg-red-500" : "bg-green-500"
                    }`}
                >
                    For {status}
                </span>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Image Gallery */}
                <div className="space-y-4">
                    {/* Main Image */}
                    <img
                        src={mainImage || "https://via.placeholder.com/500"} // Fallback image
                        alt={propertyName}
                        className="w-full h-[500px] object-cover rounded-lg shadow-md"
                    />
                    {/* Thumbnails */}
                    {moreImages && moreImages.length > 0 && (
                        <div className="flex overflow-x-auto gap-2 pb-2">
                            {/* Include profileImage as a thumbnail */}
                            <img
                                src={profileImage}
                                alt="Profile Thumbnail"
                                className={`w-24 h-24 object-cover rounded-lg cursor-pointer border-2 ${
                                    mainImage === profileImage ? "border-[#27ae60]" : "border-transparent"
                                }`}
                                onClick={() => handleThumbnailClick(profileImage)}
                            />
                            {moreImages.map((image, index) => (
                                <img
                                    key={index}
                                    src={image}
                                    alt={`Thumbnail ${index + 1}`}
                                    className={`w-24 h-24 object-cover rounded-lg cursor-pointer border-2 ${
                                        mainImage === image ? "border-[#27ae60]" : "border-transparent"
                                    }`}
                                    onClick={() => handleThumbnailClick(image)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Column: Property Details */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <span className="text-sm text-gray-500 capitalize block mb-2">{category}</span>
                    <p className="text-2xl font-bold text-green-600 mb-4">{formattedPrice}</p>
                    <div className="space-y-2 mb-4">
                        <p className="text-gray-600">
                            <span className="inline-block mr-1">📍</span>
                            {location}
                        </p>
                        <p className="text-gray-600">
                            <span className="inline-block mr-1">📏</span>
                            {area} sq ft
                        </p>
                        <p className="text-gray-600">
                            <span className="inline-block mr-1">🏷️</span>
                            Status: For {status}
                        </p>
                        <p className="text-gray-600">
                            <span className="inline-block mr-1">👁️</span>
                            Views: {property.views || 0} {/* Display views if available */}
                        </p>
                    </div>
                    {description && (
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">Description</h3>
                            <p className="text-gray-600 mt-2">{description}</p>
                        </div>
                    )}
                    <p className="text-gray-500 mb-4">
                        Listed by {owner.name}
                    </p>
                    {!isOwner && (
                        <button
                            className="w-full bg-[#27ae60] text-white py-2 rounded-lg hover:bg-green-700 transition duration-200"
                            onClick={handleViewProperty}>
                            Contact Owner
                        </button>
                    )}

                    {isOwner && (
                        <>
                            <button
                                className="w-full bg-[#27ae60] text-white my-5 py-2 rounded-lg hover:bg-green-700 transition duration-200"
                                onClick={handleEdit}>
                                Update Property
                            </button>
                            <button
                                className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition duration-200"
                                onClick={handleDelete}>
                                Delete Property
                            </button>
                        </>
                    )}

                    {!isOwner && currentUserId && (
                        <button
                            onClick={handleShortlist}
                            className="w-full mt-4 bg-[#27ae60] text-white py-2 rounded-lg hover:bg-green-700 transition duration-200">
                            {isShortlisted ? "Remove from Shortlist" : "Add to Shortlist"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PropertyDetails;