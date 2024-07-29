import mongoose from "mongoose";

const subscriptionSchema = mongoose.Schema({
    email: {
        type: String,
    }
}, { timestamps: true })

export const Subscribe = mongoose.model("Subscribes", subscriptionSchema);