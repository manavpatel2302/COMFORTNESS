import express from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: "http://localhost:5173", // Your React frontend URL (Vite default)
    credentials: true, // If you add sessions later
}));
app.use(express.json());
app.use(cookieParser());

app.use(express.urlencoded({extended: true}))  
app.use("/user", authRoutes); 

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/COMFORTNEST')
    .then(() => { 
        console.log("Connection Open!!")
    })
    .catch(err => { 
        console.error(err)
    });

app.get('/', (req, res) => {
    res.send('Server is running...')
    console.log('COMFORTNEST Backend')
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}...`)
});
