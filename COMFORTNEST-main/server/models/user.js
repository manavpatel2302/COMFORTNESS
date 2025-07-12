import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type: String, 
        required: true 
    },
    mobileNumber:{
        type: String, 
        required: true 
    },
    email:{
        type: String, 
        required: true, 
        unique: true
    },
    password:{
        type: String, 
        required: true
    },
    role: {
        type: String, 
        enum: ['user', 'owner'],
        required: true,
        default: 'user'
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    shortlisted: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Property" 
    }],
}); 

const User = mongoose.model('User', userSchema);

export default User;