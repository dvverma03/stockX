import { isMultipartBody } from "openai/uploads";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import nodemailer from "nodemailer";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Subscribe } from "../models/subscribe.model.js";
import dotenv from "dotenv"

// dotenv.config({
//     path: '.././.env'
// })
 
const subscribe = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) {
        throw new ApiError(400, "Email is mandatory for newsletter.")
    }
    const user = await Subscribe.findOne({ email });
    if (user) {
        throw new ApiError(400, "You have already subscribed!");
    }
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth:{
            user: process.env.Username,
            pass: process.env.Password
        },
    })
    const mailData = {
        from: process.env.Username,
        to: email,
        subject: "Thanks for subscribing to StockX newsletter!",
        text: `
        Hello,
    
        Thank you for subscribing to the StockX newsletter!
    
        At StockX, we analyze stock data using the past 15 days of results to provide you with accurate predictions on buying and selling prices. Stay informed with our updates on the latest market news.
    
        We look forward to helping you make informed investment decisions!
    
        Best regards,
        The StockX Team
        `,
        html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="text-align: center; background-color: #4E31B6; color: #fff; padding: 20px;">
                <h1>Welcome to StockX!</h1>
            </div>
            <div style="padding: 20px;">
                <p>Hello,</p>
                <p>Thank you for subscribing to the <strong>StockX newsletter</strong>!</p>
                <p>
                    At StockX, we specialize in analyzing stock data with the latest 15-day trends to offer you insights on optimal buying and selling points.
                    Along with stock predictions, we keep you updated with the current news and trends in the market.
                </p>
                <p>We look forward to helping you make informed investment decisions!</p>
                <p>Best regards,<br>The StockX Team</p>
            </div>
            <div style="text-align: center; background-color: #f1f1f1; padding: 10px;">
                <p style="font-size: 12px; color: #777;">You're receiving this email because you subscribed to the StockX newsletter.</p>
            </div>
        </div>
        `
    };
    console.log("aaya")

    transporter.sendMail(mailData, async function (error, info) {
        if (error) {
            console.log(error)
        }

        const newUser = await Subscribe.create({
            email
        });

        res
            .status(200)
            .json(new ApiResponse(200, { message: "Mail send", newUser }));
    })

})


export { subscribe };