import mongoose from "mongoose"

const passwordSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true,
    },
    service: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: false,
        trim: true
    },
    email: {
        type: String,
        required: false,
        trim: true,
    },
    password: {
        type: String,
        required: true
    }
}, {timestamps: true})

export const Password = mongoose.model("Password", passwordSchema)