import React from "react";
import { Link } from "react-router-dom"; // For linking to details page

const PropertyCard = ({ property }) => {
    const { profileImage, propertyName, location, category, status, price, owner, area } = property;

    // Format the price based on status
    const formattedPrice = status === "rent"
        ? `₹${price.rentPrice}/month`
        : `₹${price.salePriceRange.min}-${price.salePriceRange.max} Lakhs`;

    // Truncate long text with ellipsis
    const truncateText = (text, maxLength) => {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + "...";
        }
        return text;
    };

    return (
        <div className="property-card bg-white rounded-lg shadow-md overflow-hidden h-96 w-72 flex flex-col justify-between">
            {/* Property Image */}
            <div className="relative h-40">
                <img
                    src={profileImage || "https://via.placeholder.com/288/160"} // Fallback image
                    alt={propertyName}
                    className="w-full h-full object-cover"
                />
                <span
                    className={`absolute top-2 left-2 px-2 py-1 text-sm font-semibold text-white rounded ${
                        status === "rent" ? "bg-red-500" : "bg-green-500"
                    }`}
                >
                    For {status}
                </span>
            </div>

            {/* Card Content */}
            <div className="p-4 flex flex-col justify-between h-56">
                {/* Category and Name */}
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500 capitalize line-clamp-1">
                        {truncateText(category, 10)}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
                        {truncateText(propertyName, 20)}
                    </h3>
                </div>

                {/* Location */}
                <p className="text-gray-600 text-sm mt-1 line-clamp-1">
                    <span className="inline-block mr-1">📍</span>
                    {truncateText(location, 25)}
                </p>

                {/* Area */}
                <p className="text-gray-600 text-sm mt-1 line-clamp-1">
                    <span className="inline-block mr-1">📏</span>
                    {area} sq ft
                </p>

                {/* Price */}
                <p className="text-lg font-bold text-green-600 mt-2 line-clamp-1">
                    {truncateText(formattedPrice, 20)}
                </p>

                {/* Owner */}
                <p className="text-gray-500 text-sm mt-1 line-clamp-1">
                    Listed by {truncateText(owner.name, 15)}
                </p>

                {/* View Details Button */}
                <Link
                    to={`/property/${property._id}`}
                    className="block mt-4 text-center bg-[#27ae60] text-white py-2 rounded-lg hover:bg-green-700 transition duration-200"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
};

export default PropertyCard;