import mongoose from "mongoose";
import validator from "validator";

const StudentSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, "Name is required"], 
        trim: true 
    },
    email: { 
        type: String, 
        required: [true, "Email is required"], 
        unique: true, 
        lowercase: true, 
        validate: [validator.isEmail, "Please provide a valid email address"] 
    },
    age: { 
        type: Number, 
        required: [true, "Age is required"], 
        min: [0, "Age must be a positive number"] 
    },
    gender: { 
        type: String, 
        enum: ["Male", "Female", "Other"], 
        required: [true, "Gender is required"] 
    },
    phone: { 
        type: String, 
        required: [true, "Phone number is required"], 
        validate: {
            validator: function(v) {
                return /\d{10}/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    address: { 
        type: String, 
        required: [true, "Address is required"], 
        trim: true 
    },
    image: { 
        type: String, 
        default : null
    }
}, { timestamps: true });

export default mongoose.model("Student", StudentSchema);
