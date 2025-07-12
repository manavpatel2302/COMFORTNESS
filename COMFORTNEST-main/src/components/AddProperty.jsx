import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AddProperty = () => {
    const [profileImage, setProfileImage] = useState(null);
    const [propertyName, setPropertyName] = useState("");
    const [location, setLocation] = useState("");
    const [category, setCategory] = useState("office");
    const [status, setStatus] = useState("rent");
    const [rentPrice, setRentPrice] = useState("");
    const [salePriceMin, setSalePriceMin] = useState("");
    const [salePriceMax, setSalePriceMax] = useState("");
    const [moreImages, setMoreImages] = useState([]);
    const [description, setDescription] = useState("");
    const [area, setArea] = useState("");
    const [message, setMessage] = useState("");
    const [role, setRole] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const checkUserRole = async () => {
            try {
                const response = await fetch("http://localhost:5000/user/dashboard", {
                    method: "GET",
                    credentials: "include",
                });
                if (response.ok) {
                    const data = await response.json();
                    setRole(data.role);
                    if (data.role !== "owner") navigate("/");
                } else {
                    navigate("/");
                }
            } catch (error) {
                console.error("Check role error at", new Date().toISOString(), ":", error);
                navigate("/");
            }
        };
        checkUserRole();
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submit button clicked at", new Date().toISOString(), {
            propertyName,
            location,
            category,
            status,
            area,
            profileImage,
            moreImages,
        });

        // Client-side validation (optional but recommended for UX)
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
        if (!profileImage) {
            setMessage("Profile image is required");
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
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10-second timeout
            const response = await fetch("http://localhost:5000/user/add-property", {
                method: "POST",
                body: formData,
                credentials: "include",
                signal: controller.signal,
            });
            clearTimeout(timeoutId);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            console.log("Response received at", new Date().toISOString(), "with status:", response.status);
            const data = await response.json();
            // console.log("Response data:", data);
            const newPropertyId = data._id; // Assuming the backend returns { _id, ... }
            if (!newPropertyId) {
                throw new Error("New property ID not found in response");
            }
            if (response.ok) {
                setMessage("Property added successfully!");
                setProfileImage(null);
                setPropertyName("");
                setLocation("");
                setCategory("office");
                setStatus("rent");
                setRentPrice("");
                setSalePriceMin("");
                setSalePriceMax("");
                setMoreImages([]);
                setDescription("");
                setArea("");
                navigate(`/property/${newPropertyId}`);
                return;
            } else {
                setMessage(data.message || "Failed to add property");
                return;
            }
        } catch (error) {
            console.error("Fetch error at", new Date().toISOString(), ":", error);
            setMessage(`Error: ${error.message}`);
        }
    };

    const handleProfileImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            console.log("Selected profile image:", file.name, file.size, "bytes");
            setProfileImage(file);
        }
    };

    const handleMoreImagesChange = (e) => {
        const files = Array.from(e.target.files);
        if (moreImages.length + files.length + (profileImage ? 1 : 0) > 10) {
            setMessage("Total number of images (including profile) cannot exceed 10.");
            return;
        }
        // console.log("Selected additional images:", files.map(f => f.name));
        setMoreImages((prevImages) => [...prevImages, ...files]);
    };

    const removeImage = (index) => {
        setMoreImages((prevImages) => prevImages.filter((_, i) => i !== index));
    };

    const removeProfileImage = () => {
        setProfileImage(null);
    };

    if (role === null) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 py-20 mt-5">
            <div className="container mx-auto max-w-4xl bg-white rounded-xl shadow-2xl p-8">
                <h2 className="text-4xl font-bold text-center text-[#27ae60] mb-10">Add New Property</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Profile Image Section */}
                    <div className="mb-6">
                        <label htmlFor="profileImage" className="block text-lg font-medium text-gray-700 mb-2">Profile Image</label>
                        <div className="relative bg-white border-2 border-gray-200 rounded-xl p-4">
                            {profileImage ? (
                                <>
                                    <img
                                        src={URL.createObjectURL(profileImage)}
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
                            ) : (
                                <div className="w-80 h-80 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-lg">
                                    No profile image selected
                                </div>
                            )}
                            <input
                                type="file"
                                name='profileImage'
                                id="profileImage"
                                accept="image/*"
                                onChange={handleProfileImageChange}
                                className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#27ae60] cursor-pointer"
                                required
                            />
                        </div>
                    </div>

                    {/* Property Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="propertyName" className="block text-lg font-medium text-gray-700">Property Name</label>
                            <input
                                type="text"
                                name="propertyName"
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
                                name="location"
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
                                name='category'
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
                                name="status"
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
                                    name="rentPrice"
                                    id="rentPrice"
                                    value={rentPrice}
                                    onChange={(e) => setRentPrice(e.target.value)}
                                    onWheel={(e) => e.target.blur()}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#27ae60] placeholder-gray-400"
                                    placeholder="Enter rent price per month"
                                    required
                                />
                            </div>
                        ) : (
                            <>
                                <div>
                                    <label htmlFor="salePriceMin" className="block text-lg font-medium text-gray-700">Sale Price Range - Min (₹ Lakhs)</label>
                                    <input
                                        type="number"
                                        name="salePriceMin"
                                        id="salePriceMin"
                                        value={salePriceMin}
                                        onChange={(e) => setSalePriceMin(e.target.value)}
                                        onWheel={(e) => e.target.blur()}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#27ae60] placeholder-gray-400"
                                        placeholder="Enter minimum sale price"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="salePriceMax" className="block text-lg font-medium text-gray-700">Sale Price Range - Max (₹ Lakhs)</label>
                                    <input
                                        type="number"
                                        name="salePriceMax"
                                        id="salePriceMax"
                                        value={salePriceMax}
                                        onChange={(e) => setSalePriceMax(e.target.value)}
                                        onWheel={(e) => e.target.blur()}
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
                            name="moreImages"
                            id="moreImages"
                            accept="image/*"
                            multiple
                            onChange={handleMoreImagesChange}
                            className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#27ae60] cursor-pointer"
                        />
                        <div className="grid grid-cols-4 gap-4 mt-4">
                            {moreImages.map((image, index) => (
                                <div key={index} className="relative">
                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt={`Preview ${index + 1}`}
                                        className="w-full h-32 object-cover rounded-lg shadow-md"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
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
                            name="description"
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
                            name="area"
                            id="area"
                            value={area}
                            onChange={(e) => setArea(e.target.value)}
                            onWheel={(e) => e.target.blur()}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#27ae60] placeholder-gray-400"
                            placeholder="Enter area in square feet"
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-[#27ae60] text-white py-3 rounded-lg font-semibold text-lg hover:bg-green-700 transition duration-300 shadow-md">
                        Add Property
                    </button>

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

export default AddProperty;