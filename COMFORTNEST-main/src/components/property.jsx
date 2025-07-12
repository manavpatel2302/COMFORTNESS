// import React, { useState, useEffect } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";

// const Property = () => {
//   const [propertyTypes, setPropertyTypes] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [properties, setProperties] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [searchParams] = useSearchParams();
//   const categoryParam = searchParams.get("category");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchPropertyTypes = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch("http://localhost:5000/user/property/type?count=true");
//         if (!response.ok) throw new Error("Failed to fetch property types");
//         const data = await response.json();
//         // console.log("Property types data from server:", data);
//         setPropertyTypes(data.types || {});
//       } catch (err) {
//         console.error("Error fetching property types:", err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchPropertyTypes();
//   }, []);

//   useEffect(() => {
//     const fetchFilteredProperties = async () => {
//       if (categoryParam) {
//         try {
//           setLoading(true);
//           console.log(categoryParam)
//           const response = await fetch(
//             `http://localhost:5000/user/property/type?category=${categoryParam}`
//           );
//           if (!response.ok) throw new Error("Failed to fetch filtered properties");
//           const data = await response.json();
//           console.log("Filtered properties data:", data);
//           setProperties(Array.isArray(data) ? data : []);
//           setSelectedCategory(categoryParam);
//         } catch (err) {
//           console.error("Error fetching filtered properties:", err);
//           setError(err.message);
//         } finally {
//           setLoading(false);
//         }
//       } else {
//         setProperties([]);
//         setSelectedCategory(null);
//       }
//     };
//     fetchFilteredProperties();
//   }, [categoryParam]); // Runs when the URL category param changes

//   if (loading) return <div className="text-center mt-10">Loading...</div>;
//   if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

//   // Define category mappings for icons and names based on DB response
//   const categories = [
//     { name: "house", icon: "./images/home..png", displayName: "FamilyHouse" },
//     { name: "office", icon: "./images/p.png", displayName: "Office" },
//     { name: "apartment", icon: "./images/y.png", displayName: "Apartment" },
//     { name: "pg/hostel", icon: "./images/pg.png", displayName: "PG & Hostel" },
//     { name: "villa", icon: "./images/red.png", displayName: "Villa" },
//   ];

//   return (
//     <div className="property">
//       <div className="property_content">
//         <div className="info">
//           <h1>Featured Property <br /> Types</h1>
//           <p>Find All Type of Property</p>
//         </div>

//         {!selectedCategory && (
//           <div className="grid">
//             {categories.map(({ name, icon, displayName }) => (
//               <div
//                 key={name}
//                 className="section"
//                 onClick={() => navigate(`/properties?category=${name}`)}
//               >
//                 <img className="icon" src={icon} alt={`${name}-picture`} />
//                 <h3>{displayName}</h3>
//                 <label className="available">
//                   {propertyTypes[name] || 0} <br />Property
//                 </label>
//               </div>
//             ))}
//           </div>
//         )}

//         {selectedCategory && (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             <h2 className="text-2xl font-bold mb-4">
//               {selectedCategory.replace(/([A-Z])/g, " $1").trim()} Properties
//             </h2>
//             {properties.length > 0 ? (
//               properties.map((property) => {
//                 console.log("Rendering property:", property);
//                 return (
//                 <div key={property._id} className="relative">
//                   {/* Assuming PropertyCard or similar component */}
//                   <div className="p-4 border rounded shadow">
//                     <h4>{property.propertyName || "No Name"}</h4>
//                     <p>{property.location || "No Location"}</p>
//                   </div>
//                 </div>
//               )})
//             ) : (
//               <p className="text-center text-gray-600">No properties found.</p>
//             )}
//             <button
//               onClick={() => navigate("/properties")}
//               className="mt-4 p-2 bg-gray-200 rounded"
//             >
//               Back to All Types
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Property;
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Property = () => {
  console.log("Property component loaded"); // Debug component load
  const [propertyTypes, setPropertyTypes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Fetching property types..."); // Debug start
    const fetchPropertyTypes = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/user/property/type?count=true", {
          credentials: "include", // Include cookies for auth
        });
        console.log("Response status:", response.status); // Debug status
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        console.log("Property types data from server:", data);
        setPropertyTypes(data.types || {});
      } catch (err) {
        console.error("Error fetching property types:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPropertyTypes();
  }, []);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  const categories = [
    { name: "house", icon: "./images/home..png", displayName: "FamilyHouse" },
    { name: "office", icon: "./images/p.png", displayName: "Office" },
    { name: "apartment", icon: "./images/y.png", displayName: "Apartment" },
    { name: "pg/hostel", icon: "./images/pg.png", displayName: "PG & Hostel" },
    { name: "villa", icon: "./images/red.png", displayName: "Villa" },
  ];

  return (
    <div className="property">
      <div className="property_content">
        <div className="info">
          <h1>Featured Property <br /> Types</h1>
          <p>Find All Type of Property</p>
        </div>

        <div className="grid">
          {categories.map(({ name, icon, displayName }) => (
            <div
              key={name}
              className="section"
              onClick={() => navigate(`/properties/category?category=${name}`)}
            >
              <img className="icon" src={icon} alt={`${name}-picture`} />
              <h3>{displayName}</h3>
              <label className="available">
                {propertyTypes[name] || 0} <br />Property
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Property;