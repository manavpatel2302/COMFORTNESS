import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import Property from "../models/property.js";
import dotenv from "dotenv";
import cloudinary from "../config/cloudinary.js";
import upload from "../middleware/multer.js";
import { Navigate } from "react-router";

dotenv.config();

const router = express.Router();

// Middleware to authenticate token from cookie
const authenticateToken = (req, res, next) => {
    const token = req.cookies.jwt;
    // console.log("Received token:", token);
    if (!token) return res.status(401).json({ message: "No token provided" });
    const secret = process.env.JWT_SECRET || "default-secret-key"; // Temporary fallback
    jwt.verify(token, secret, (err, payload) => {
        if (err) {
            console.log("Token verification error:", err.message);
            return res.status(403).json({ message: "Invalid or expired token" });
        }
        req.user = { id: payload.id, role: payload.role };
        next();
    });
};

const isOwner = (req, res, next) => {
    if (req.user && req.user.role === "owner") {
        next();
    } else {
        return res.status(403).json({ message: "Access denied. Only owners can add properties." });
    }
};

// fetch owner details 
// routes.js (verify this block)
router.get("/fetch/:id", async(req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid user ID format" });
        }

        const user = await User.findById(id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const properties = await Property.find({ "owner.userId": id });
        const totalProperties = properties.length;
        const totalViews = properties.reduce((sum, prop) => sum + (prop.views || 0), 0);

        res.json({
            ...user.toObject(),
            totalProperties,
            totalViews,
        });
    } catch (error) {
        console.error("Error fetching user details:", error);
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/property/owner/:userId", async(req, res) => {
    try {
        const { userId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID format" });
        }
        const properties = await Property.find({ "owner.userId": userId });
        res.json(properties);
    } catch (error) {
        console.error("Error fetching owner properties:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Route to handle property types (counts or filtered listings)
router.get("/property/type", async(req, res) => {
    try {
        const { count, category } = req.query;

        // Case 1: Fetch count of properties (with optional category filter)
        if (count === "true") {
            let query = {};
            if (category) {
                query.category = category; // Filter by specific category if provided
            }
            const properties = await Property.find(query);
            const countByCategory = properties.reduce((acc, prop) => {
                acc[prop.category] = (acc[prop.category] || 0) + 1;
                return acc;
            }, {});
            return res.json({ types: countByCategory });
        }

        // Case 2: Fetch properties by category
        if (category) {
            const properties = await Property.find({ category: category });
            if (!properties.length) {
                return res.status(404).json({ message: "No properties found for this category" });
            }
            return res.json(properties);
        }

        // Default case: Return error if no valid query
        return res.status(400).json({ message: "Please specify ?count=true or ?category={categoryName}" });
    } catch (error) {
        console.error("Error in /property/type route:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Signup Route
router.post("/signup", async(req, res) => {
    try {
        const { username, mobileNumber, email, password, role } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });
        if (!["user", "owner"].includes(role)) return res.status(400).json({ message: "Invalid role. Must be 'user' or 'owner'." });
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, mobileNumber, email, password: hashedPassword, role });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Signup route error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Login Route
router.post("/login", async(req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || "default-secret-key", { expiresIn: "1h" });
        res.cookie("jwt", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 1000 * 60 * 60 });
        res.status(200).json({ userId: user._id, username: user.username, role: user.role });
    } catch (error) {
        console.error("Login route error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

router.post("/logout", (req, res) => {
    res.clearCookie("jwt");
    res.status(200).json({ message: "Logged out successfully" });
});

router.get("/dashboard", authenticateToken, async(req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json({ message: "Dashboard access granted", user, role: req.user.role });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

router.post(
    "/add-property",
    authenticateToken,
    isOwner,
    upload.fields([{ name: "profileImage", maxCount: 1 }, { name: "moreImages", maxCount: 10 }]),
    async(req, res) => {
        try {
            const { propertyName, location, category, status, price, description, area } = req.body;

            const missingFields = [];
            if (!propertyName) missingFields.push("propertyName");
            if (!location) missingFields.push("location");
            if (!category) missingFields.push("category");
            if (!status) missingFields.push("status");
            if (!area) missingFields.push("area");
            if (!price) missingFields.push("price");
            if (!req.files || !req.files.profileImage) missingFields.push("profileImage");

            if (missingFields.length > 0) {
                return res.status(400).json({ message: `Missing required fields: ${missingFields.join(", ")}` });
            }

            let parsedPrice;
            try {
                parsedPrice = JSON.parse(price);
                if (status === "rent" && (!parsedPrice.rentPrice || typeof parsedPrice.rentPrice !== "number")) {
                    return res.status(400).json({ message: "Invalid rentPrice: must be a number" });
                }
                if (status === "sale" && (!parsedPrice.salePriceRange || typeof parsedPrice.salePriceRange.min !== "number" || typeof parsedPrice.salePriceRange.max !== "number")) {
                    return res.status(400).json({ message: "Invalid salePriceRange: min and max must be numbers" });
                }
            } catch (error) {
                return res.status(400).json({ message: "Invalid price format: must be valid JSON" });
            }

            const parsedArea = Number(area);
            if (isNaN(parsedArea)) {
                return res.status(400).json({ message: "Invalid area: must be a number" });
            }

            let profileImageUrl = "";
            if (req.files && req.files.profileImage && req.files.profileImage[0].buffer) {
                try {
                    const result = await new Promise((resolve, reject) => {
                        cloudinary.uploader.upload_stream({ folder: "comfortnest/properties" },
                            (error, result) => (error ? reject(error) : resolve(result))
                        ).end(req.files.profileImage[0].buffer);
                    });
                    profileImageUrl = result.secure_url;
                    console.log("Profile image uploaded to:", profileImageUrl);
                } catch (uploadError) {
                    console.error("Cloudinary upload error for profileImage:", uploadError.message, uploadError);
                    return res.status(500).json({ message: `Failed to upload profile image: ${uploadError.message}` });
                }
            }
            if (!profileImageUrl) {
                return res.status(400).json({ message: "Profile image upload failed" });
            }

            const moreImagesUrls = [];
            if (req.files && req.files.moreImages) {
                for (const file of req.files.moreImages) {
                    try {
                        const result = await new Promise((resolve, reject) => {
                            cloudinary.uploader.upload_stream({ folder: "comfortnest/properties" },
                                (error, result) => (error ? reject(error) : resolve(result))
                            ).end(file.buffer);
                        });
                        moreImagesUrls.push(result.secure_url);
                        console.log("Additional image uploaded to:", result.secure_url);
                    } catch (uploadError) {
                        console.error("Cloudinary upload error for moreImages:", uploadError.message, uploadError);
                        return res.status(500).json({ message: `Failed to upload additional images: ${uploadError.message}` });
                    }
                }
            }

            const user = await User.findById(req.user.id).select("username");
            if (!user) throw new Error("User not found");
            const newProperty = new Property({
                propertyName,
                location,
                category,
                status,
                price: parsedPrice,
                description: description || "",
                area: parsedArea,
                profileImage: profileImageUrl,
                moreImages: moreImagesUrls,
                owner: {
                    userId: req.user.id,
                    name: user.username || "Unknown Owner",
                },
                views: 0,
            });

            const savedProperty = await newProperty.save();
            res.status(201).json({ _id: savedProperty._id, message: "Property added successfully" });
        } catch (error) {
            console.error("Add property error at", new Date().toISOString(), ":", error.message, error);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }
);

router.get("/my-properties", authenticateToken, async(req, res) => {
    try {
        const properties = await Property.find({ "owner.userId": req.user.id });
        res.status(200).json(properties);
    } catch (error) {
        console.error("Error fetching my properties:", error);
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/shortlisted-properties", authenticateToken, async(req, res) => {
    try {

        const user = await User.findById(req.user.id).populate("shortlisted");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user.shortlisted);
    } catch (error) {
        console.error("Error fetching shortlisted properties:", error);
        res.status(500).json({ message: "Server error" });
    }
});

router.post("/shortlist-property/:propertyId", authenticateToken, async(req, res) => {
    try {
        const { propertyId } = req.params;
        const userId = req.user.id;

        // Validate propertyId
        if (!mongoose.Types.ObjectId.isValid(propertyId)) {
            return res.status(400).json({ message: "Invalid property ID" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const property = await Property.findById(propertyId);
        if (!property) {
            return res.status(404).json({ message: "Property not found" });
        }

        // Check if property is already shortlisted
        const isShortlisted = user.shortlisted.includes(propertyId);
        let updatedUser;

        if (isShortlisted) {
            // Remove from shortlisted
            updatedUser = await User.findByIdAndUpdate(
                userId, { $pull: { shortlisted: propertyId } }, { new: true, runValidators: true }
            );
            res.status(200).json({ message: "Property removed from shortlist", user: updatedUser });
        } else {
            // Add to shortlisted
            updatedUser = await User.findByIdAndUpdate(
                userId, { $push: { shortlisted: propertyId } }, { new: true, runValidators: true }
            );
            res.status(200).json({ message: "Property added to shortlist", user: updatedUser });
        }
    } catch (error) {
        console.error("Error updating shortlist:", error);
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/properties", async(req, res) => {
    try {
        const properties = await Property.find();
        res.status(200).json(properties);
    } catch (error) {
        console.error("Fetch properties error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/property/:id", async(req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) return res.status(404).json({ message: "Property not found" });
        property.views += 1;
        await property.save();
        res.status(200).json(property);
    } catch (error) {
        console.error("Fetch property error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// New GET route to fetch property for editing
router.get("/edit-property/:id", authenticateToken, isOwner, async(req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) {
            return res.status(404).json({ message: "Property not found" });
        }
        if (!req.user || (req.user && property.owner.userId.toString() !== req.user.id)) {
            return res.status(403).json({ message: "Unauthorized: You must be the owner to edit", redirectTo: `/property/${req.params.id}` });
        }
        res.status(200).json(property);
    } catch (error) {
        console.error("Get property error at", new Date().toISOString(), ":", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// New PUT route to update property
router.put(
    "/property/:id",
    authenticateToken,
    isOwner,
    upload.fields([{ name: "profileImage", maxCount: 1 }, { name: "moreImages", maxCount: 10 }]),
    async(req, res) => {
        try {
            const property = await Property.findById(req.params.id);
            if (!property) {
                return res.status(404).json({ message: "Property not found" });
            }
            if (property.owner.userId.toString() !== req.user.id) {
                return res.status(403).json({ message: "Unauthorized: You can only edit your own property" });
            }

            const { propertyName, location, category, status, price, description, area } = req.body;

            // Update fields with new values or keep old ones if not provided
            property.propertyName = propertyName || property.propertyName;
            property.location = location || property.location;
            property.category = category || property.category;
            property.status = status || property.status;
            property.price = price ? JSON.parse(price) : property.price; // Assuming price is sent as JSON string
            property.description = description || property.description;
            property.area = area ? Number(area) : property.area;

            // Handle profile image update
            if (req.files && req.files.profileImage && req.files.profileImage[0].buffer) {
                const result = await new Promise((resolve, reject) => {
                    cloudinary.uploader.upload_stream({ folder: "comfortnest/properties" },
                        (error, result) => (error ? reject(error) : resolve(result))
                    ).end(req.files.profileImage[0].buffer);
                });
                property.profileImage = result.secure_url;
            }

            // Handle more images update (add new images, keep existing ones)
            if (req.files && req.files.moreImages) {
                const moreImagesUrls = [];
                for (const file of req.files.moreImages) {
                    const result = await new Promise((resolve, reject) => {
                        cloudinary.uploader.upload_stream({ folder: "comfortnest/properties" },
                            (error, result) => (error ? reject(error) : resolve(result))
                        ).end(file.buffer);
                    });
                    moreImagesUrls.push(result.secure_url);
                }
                property.moreImages = [...property.moreImages, ...moreImagesUrls];
            }

            await property.save();
            res.status(200).json({ message: "Property updated successfully", property });
        } catch (error) {
            console.error("Update property error at", new Date().toISOString(), ":", error);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }
);

// routes.js (add this block)
router.get("/property/:id/ownerdetails", async(req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) return res.status(404).json({ message: "Property not found" });

        const owner = await User.findById(property.owner.userId).select("username email mobileNumber createdAt");
        if (!owner) return res.status(404).json({ message: "Owner not found" });

        const properties = await Property.find({ "owner.userId": property.owner.userId });
        const totalViews = properties.reduce((sum, prop) => sum + (prop.views || 0), 0);

        res.json({...owner.toObject(), totalViews, userId: property.owner.userId });
    } catch (error) {
        console.error("Error fetching owner details:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// New DELETE route to remove property
router.delete("/property/:id", authenticateToken, isOwner, async(req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) {
            return res.status(404).json({ message: "Property not found" });
        }
        if (property.owner.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized: You can only delete your own property" });
        }

        await Property.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Property deleted successfully" });
    } catch (error) {
        console.error("Delete property error at", new Date().toISOString(), ":", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// user edit profile route
router.put("/profile", authenticateToken, async(req, res) => {
    try {
        console.log("Request received for /profile, req.user:", req.user);
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Authentication failed" });
        }

        const { username, email } = req.body;
        // Trim and validate inputs
        const trimmedUsername = username ? username.trim() : "";
        const trimmedEmail = email ? email.trim() : "";
        if (!trimmedUsername || !trimmedEmail) {
            return res.status(400).json({ message: "Username and email are required and cannot be empty or just spaces" });
        }
        if (trimmedUsername.match(/^[\s]+$/)) {
            return res.status(400).json({ message: "Username cannot be just spaces" });
        }
        if (trimmedEmail.match(/^[\s]+$/)) {
            return res.status(400).json({ message: "Email cannot be just spaces" });
        }

        const existingUser = await User.findOne({ email: trimmedEmail, _id: { $ne: req.user.id } });
        if (existingUser) {
            console.log("Duplicate email found:", trimmedEmail);
            return res.status(409).json({ message: "Email already exists, try another one" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id, { username: trimmedUsername, email: trimmedEmail }, { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ user: updatedUser });
    } catch (error) {
        console.error("Update error:", error);
        res.status(500).json({ message: error.message });
    }
});



export default router;