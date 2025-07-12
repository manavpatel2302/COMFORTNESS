import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditProperty = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [profileImage, setProfileImage] = useState(null);
    const [existingProfileImage, setExistingProfileImage] = useState(null); // For displaying existing profile image
    const [propertyName, setPropertyName] = useState("");
    const [location, setLocation] = useState("");
    const [category, setCategory] = useState("office");
    const [status, setStatus] = useState("rent");
    const [rentPrice, setRentPrice] = useState("");
    const [salePriceMin, setSalePriceMin] = useState("");
    const [salePriceMax, setSalePriceMax] = useState("");
    const [moreImages, setMoreImages] = useState([]);
    const [existingMoreImages, setExistingMoreImages] = useState([]); // For displaying existing additional images
    const [description, setDescription] = useState("");
    const [area, setArea] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const response = await fetch(`http://localhost:5000/user/edit-property/${id}`, {
                    method: "GET",
                    credentials: "include",
                });
                if (response.ok) {
                    const data = await response.json();
                    setPropertyName(data.propertyName || "");
                    setLocation(data.location || "");
                    setCategory(data.category || "office");
                    setStatus(data.status || "rent");
                    setRentPrice(data.price?.rentPrice?.toString() || "");
                    setSalePriceMin(data.price?.salePriceRange?.min?.toString() || "");
                    setSalePriceMax(data.price?.salePriceRange?.max?.toString() || "");
                    setDescription(data.description || "");
                    setArea(data.area?.toString() || "");
                    setExistingProfileImage(data.profileImage || null);
                    setExistingMoreImages(data.moreImages || []);
                } else {
                    const data = await response.json();
                    if (response.status === 403 && data.redirectTo) {
                        navigate(data.redirectTo); // Redirect before setting state
                        return; // Exit early to prevent further rendering
                    }
                    setMessage(data.message || "Failed to fetch property");
                }
            } catch (error) {
                console.error("Error fetching property:", error);
                setMessage("Error fetching property");
            }
            finally {
            setLoading(false); // Allow render only after check
            }
        };
        fetchProperty();
    }, [id, navigate]); // Add navigate to dependency array

    if (loading) return <div>Loading authorization...</div>; // Block render until check completes

    if (message) {
        return <div className="text-center mt-10 text-red-500">{message}</div>; // Show error if applicable
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!propertyName) {
            setMessage("Property name is required");
            return;
        }
        if (!location) {
            setMessage("Location is required");
            return;
        }
        if (!category) {
            setMessage("Category is required");
            return;
        }
        if (!status) {
            setMessage("Status is required");
            return;
        }
        if (!area || isNaN(Number(area))) {
            setMessage("Area must be a valid number");
            return;
        }
        if (status === "rent") {
            if (!rentPrice || isNaN(Number(rentPrice))) {
                setMessage("Rent price must be a valid number");
                return;
            }
        } else {
            if (!salePriceMin || isNaN(Number(salePriceMin))) {
                setMessage("Minimum sale price must be a valid number");
                return;
            }
            if (!salePriceMax || isNaN(Number(salePriceMax))) {
                setMessage("Maximum sale price must be a valid number");
                return;
            }
        }
        if (!profileImage && !moreImages.length && !existingProfileImage && !existingMoreImages.length) {
            setMessage("At least one image is required");
            return;
        }

        const formData = new FormData();
        formData.append("propertyName", propertyName);
        formData.append("location", location);
        formData.append("category", category);
        formData.append("status", status);
        formData.append("area", area);
        if (status === "rent") {
            formData.append("price", JSON.stringify({ rentPrice: Number(rentPrice) }));
        } else {
            formData.append("price", JSON.stringify({ salePriceRange: { min: Number(salePriceMin), max: Number(salePriceMax) } }));
        }
        if (description) formData.append("description", description);
        if (profileImage) formData.append("profileImage", profileImage);
        moreImages.forEach((file) => formData.append("moreImages", file));

        try {
            const response = await fetch(`http://localhost:5000/user/property/${id}`, {
                method: "PUT",
                body: formData,
                credentials: "include",
            });
            const data = await response.json();
            if (response.ok) {
                setMessage("Property updated successfully!");
                setTimeout(() => navigate(`/property/${id}`), 2000);
            } else {
                setMessage(data.message || "Failed to update property");
            }
        } catch (error) {
            console.error("Error updating property:", error);
            setMessage("Error updating property");
        }
    };

    const handleProfileImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
        }
    };

    const handleMoreImagesChange = (e) => {
        const files = Array.from(e.target.files);
        const totalImages = (profileImage ? 1 : 0) + moreImages.length + files.length;
        if (totalImages > 10) {
            setMessage("Total number of images (including profile) cannot exceed 10.");
            return;
        }
        setMoreImages((prevImages) => [...prevImages, ...files]);
    };

    const removeImage = (index, isExisting = false) => {
        if (isExisting) {
            setExistingMoreImages((prevImages) => prevImages.filter((_, i) => i !== index));
        } else {
            setMoreImages((prevImages) => prevImages.filter((_, i) => i !== index));
        }
    };

    const removeProfileImage = () => {
        setProfileImage(null);
        setExistingProfileImage(null);
    };

    return (
        <div className="min-h-screen bg-gray-100 py-20 mt-5">
            <div className="container mx-auto max-w-4xl bg-white rounded-xl shadow-2xl p-8">
                <h2 className="text-4xl font-bold text-center text-[#27ae60] mb-10">Edit Property</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Profile Image Section */}
                    <div className="mb-6">
                        <label htmlFor="profileImage" className="block text-lg font-medium text-gray-700 mb-2">Profile Image</label>
                        <div className="relative bg-white border-2 border-gray-200 rounded-xl p-4">
                            {profileImage ? (
                                <>
                                    <img
                                        src={profileImage ? URL.createObjectURL(profileImage) : ""}
                                        alt="Profile Preview"
                                        className="w-80 h-80 object-cover rounded-lg shadow-lg transition-transform hover:scale-105"
                                    />
                                    <button
                                        type="button"
                                        onClick={removeProfileImage}
                                        className="absolute top-4 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700 transition-colors"
                                    >
                                        ×
                                    </button>
                                </>
                            ) : existingProfileImage ? (
                                <>
                                    <img
                                        src={existingProfileImage}
                                        alt="Existing Profile Preview"
                                        className="w-80 h-80 object-cover rounded-lg shadow-lg transition-transform hover:scale-105"
                                        onError={(e) => console.error("Image load error:", e.target.src)} // Debug image load failure
                                    />
                                    <button
                                        type="button"
                                        onClick={removeProfileImage}
                                        className="absolute top-4 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700 transition-colors"
                                    >
                                        ×
                                    </button>
                                </>
                            ) : (
                                <div className="w-80 h-80 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-lg">
                                    No profile image selected
                                </div>
                            )}
                            <input
                                type="file"
                                id="profileImage"
                                accept="image/*"
                                onChange={handleProfileImageChange}
                                className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#27ae60] cursor-pointer"
                            />
                        </div>
                    </div>

                    {/* Property Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="propertyName" className="block text-lg font-medium text-gray-700">Property Name</label>
                            <input
                                type="text"
                                id="propertyName"
                                value={propertyName}
                                onChange={(e) => setPropertyName(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#27ae60] placeholder-gray-400"
                                placeholder="Enter property name"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="location" className="block text-lg font-medium text-gray-700">Location</label>
                            <input
                                type="text"
                                id="location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#27ae60] placeholder-gray-400"
                                placeholder="Enter location"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="category" className="block text-lg font-medium text-gray-700">Category</label>
                            <select
                                id="category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#27ae60] text-gray-700"
                                required
                            >
                                <option value="office">Office</option>
                                <option value="apartment">Apartment</option>
                                <option value="villa">Villa</option>
                                <option value="house">House</option>
                                <option value="pg/hostel">PG/Hostel</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="status" className="block text-lg font-medium text-gray-700">Status</label>
                            <select
                                id="status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#27ae60] text-gray-700"
                                required
                            >
                                <option value="rent">Rent</option>
                                <option value="sale">Sale</option>
                            </select>
                        </div>
                    </div>

                    {/* Price Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {status === "rent" ? (
                            <div>
                                <label htmlFor="rentPrice" className="block text-lg font-medium text-gray-700">Rent Price (₹ per month)</label>
                                <input
                                    type="number"
                                    id="rentPrice"
                                    value={rentPrice}
                                    onChange={(e) => setRentPrice(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#27ae60] placeholder-gray-400"
                                    placeholder="Enter rent price per month"
                                    required
                                />
                            </div>
                        ) : (
                            <>
                                <div>
                                    <label htmlFor="salePriceMin" className="block text-lg font-medium text-gray-700">Sale Price Range - Min (₹)</label>
                                    <input
                                        type="number"
                                        id="salePriceMin"
                                        value={salePriceMin}
                                        onChange={(e) => setSalePriceMin(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#27ae60] placeholder-gray-400"
                                        placeholder="Enter minimum sale price"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="salePriceMax" className="block text-lg font-medium text-gray-700">Sale Price Range - Max (₹)</label>
                                    <input
                                        type="number"
                                        id="salePriceMax"
                                        value={salePriceMax}
                                        onChange={(e) => setSalePriceMax(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#27ae60] placeholder-gray-400"
                                        placeholder="Enter maximum sale price"
                                        required
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    {/* Additional Images Section */}
                    <div>
                        <label htmlFor="moreImages" className="block text-lg font-medium text-gray-700">Additional Images (Max 10 total, including profile)</label>
                        <input
                            type="file"
                            id="moreImages"
                            accept="image/*"
                            multiple
                            onChange={handleMoreImagesChange}
                            className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#27ae60] cursor-pointer"
                        />
                        <div className="grid grid-cols-4 gap-4 mt-4">
                            {existingMoreImages.map((image, index) => (
                                <div key={index} className="relative">
                                    <img
                                        src={image}
                                        alt={`Existing Preview ${index + 1}`}
                                        className="w-full h-32 object-cover rounded-lg shadow-md"
                                        onError={(e) => console.error("Image load error:", e.target.src)} // Debug image load failure
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index, true)}
                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700 transition-colors"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                            {moreImages.map((image, index) => (
                                <div key={index + existingMoreImages.length} className="relative">
                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt={`New Preview ${index + 1}`}
                                        className="w-full h-32 object-cover rounded-lg shadow-md"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index + existingMoreImages.length, false)}
                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700 transition-colors"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Description and Area */}
                    <div>
                        <label htmlFor="description" className="block text-lg font-medium text-gray-700">Description (Optional)</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#27ae60] placeholder-gray-400"
                            placeholder="Enter property description"
                            rows="4"
                        />
                    </div>
                    <div>
                        <label htmlFor="area" className="block text-lg font-medium text-gray-700">Area (sq ft)</label>
                        <input
                            type="number"
                            id="area"
                            value={area}
                            onChange={(e) => setArea(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#27ae60] placeholder-gray-400"
                            placeholder="Enter area in square feet"
                            required
                        />
                    </div>

                    {/* Update Button */}
                    <div className="space-y-4">
                        <button
                            type="submit"
                            className="w-full bg-[#27ae60] text-white py-3 rounded-lg font-semibold text-lg hover:bg-green-700 transition duration-300 shadow-md"
                        >
                            Update Property
                        </button>
                    </div>

                    {/* Message */}
                    {message && (
                        <p
                            className={`text-center mt-4 ${
                                message.includes("successfully") ? "text-green-600" : "text-red-600"
                            } font-medium`}
                        >
                            {message}
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
};

export default EditProperty;