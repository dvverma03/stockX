import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    // fullname: {
    //     type: String,
    //     // required: true,
    //     trim: true,
    //     index: true,
    // },
    // coverImage: {
    //     type: String,
    // },
    // watchHistory: [
    //     {
    //         type: Schema.Types.ObjectId,
    //         ref: "Video"
    //     }
    // ],
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    otp: {
        type: Number,
        required: true,
    },
    isVerified: {
        type: Boolean,
        required: true,
        default: false,
    },
    refreshToken: {
        type: String,
    },


}, { timestamps: true })

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
})
userSchema.methods.isPasswordCorrect = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
}
userSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        _id: this._id,
        email: this.email,
    },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        },
    )
}
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({
        _id: this._id,
    },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        },
    )
}
export const User = mongoose.model("Users", userSchema)