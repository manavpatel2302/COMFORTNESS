import dotenv from "dotenv";
dotenv.config();
import cloudinary from "cloudinary";

const configureCloudinary = () => {
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
        throw new Error("Missing Cloudinary configuration: Ensure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET are set in .env");
    }

    cloudinary.v2.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    console.log("Cloudinary configured successfully");
    return cloudinary.v2;
};

const cloudinaryInstance = configureCloudinary();
export default cloudinaryInstance;