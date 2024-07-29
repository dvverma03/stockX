import mongoose, { Schema } from "mongoose";

const userInfoSchema = mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    address: {
        type: String,
    },
    zipcode: {
        type: String,
    },
    avatar: {
        type: String,
        // required: true,
    },
    responses: {
        type: Number,
        default: 0,
    },
    lastResponseTime: {
        type: Date,
        default: null // or default: new Date(0)
    },
    city: {
        type: String,
    },
    country: {
        type: String,
    },
    fullName: {
        type: String,
    },
    username: {
        type: String,
        unique: true,
    },
    dob: {
        type: String,
    },
    notification: {
        type: Boolean,
        default: false,
    },
    favorites: {
        type: [String],
        default: [],
    },

}, { timestamps: true })


export const UserInfo = mongoose.model("UserInfo", userInfoSchema);