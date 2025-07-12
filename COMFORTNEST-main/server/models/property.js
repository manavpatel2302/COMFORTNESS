import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
    profileImage: {
        type: String,
        required: true,
    },
    propertyName: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        enum: ["office", "apartment", "villa", "house", "pg/hostel"],
        required: true,
    },
    status: {
        type: String,
        enum: ["rent", "sale"],
        required: true,
    },
    price: {
        rentPrice: {
            type: Number, // Price per month if status is "rent" (e.g., 5670)
            required: function () {
                return this.status === "rent";
            },
        },
        salePriceRange: {
            min: {
                type: Number,
                required: function () {
                    return this.status === "sale";
                },
            },
            max: {
                type: Number,
                required: function () {
                    return this.status === "sale";
                },
            },
        },
    },
    moreImages: {
        type: [String],
        default: [],
        validate: [arrayLimit, "Exceeds the limit of 10 images"],
    },
    owner: {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
    },
    description: {
        type: String,
        default: "",
    },
    area: {
        type: Number,
        required: true,
    },
    views: { 
        type: Number, 
        default: 0 
    },
    createdAt: {
        type: Date,
        default: Date.now, // When the property was listed
    },
    updatedAt: {
        type: Date,
        default: Date.now, // When the property was last updated
    },
});

// Validator for moreImages array
function arrayLimit(val) {
    return val.length <= 10;
}

// Update `updatedAt` on save
propertySchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

const Property = mongoose.model("Property", propertySchema);

export default Property;    