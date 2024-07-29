import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import express from 'express';
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { UserInfo } from "../models/userInfo.model.js";
import OpenAI from "openai";
import nodemailer from "nodemailer";

const openai = new OpenAI({
    apiKey: process.env.OPEN_API_KEY,  // Replace with your OpenAI API key
});


const generateTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        console.log(user)
        return { accessToken, refreshToken };

    } catch (err) {
        throw new ApiError(500, "Something went wrong while generating token");
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if ([email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({ email });

    if (existedUser) {
        throw new ApiError(409, "User already exists");
    }

    // Generate a random 6-digit OTP
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();

    // Create a new user with the OTP
    const newUser = new User({ email, password, otp: randomOtp });
    await newUser.save();

    // Send OTP using nodemailer
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.Username,
            pass: process.env.Password
        },
    });

    const mailData = {
        from: process.env.Username,
        to: email,
        subject: "StockX (Verify your identity)",
        text: `Hello, Your 6 digit OTP to continue on StockX is: ${randomOtp}`,
    };

    transporter.sendMail(mailData, async function (error, info) {
        if (error) {
            console.log(error);
        }

        res.status(200).json(
            new ApiResponse(200, {}, "Check you mail account.")
        );
    });
});

const verifyOtp = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;
    console.log(otp);
    if ([email, otp].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, "User not found");
    }
    console.log(user.otp, "userOTP")

    if (String(user.otp) !== String(otp)) {
        throw new ApiError(400, "Invalid OTP");
    }


    // Mark the user as verified
    user.isVerified = true;
    user.otp = null; // Clear the OTP after successful verification
    await user.save({ validateBeforeSave: false });

    const userInfo = await UserInfo.create({
        userId: user._id,
        username: email,
    });

    console.log("UserInfo created:", userInfo);

    // Handle the response to the client as needed


    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "User creation failed")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )
});



const loginUser = asyncHandler(async (req, res) => {
    // username , password, 
    // check if username or email or password are not empty
    // find the user
    // passeord check
    // access and refresh token generate
    // send cookie

    const { email, password } = req.body;

    if (!email) {
        throw new ApiError(400, "Username or email is required")
    }

    const user = await User.findOne({
        email
        // $or: [{ username }, { email }]
    })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }
    if (user.isVerified === false) {
        throw new ApiError(400, "User is not Verified");
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials")
    }

    const { accessToken, refreshToken } = await generateTokens(user._id);

    // console.log(accessToken, " ", refreshToken)
    // await User.findByIdAndUpdate({_id : user._id }, {refreshToken:refreshToken}, {new:true});

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    console.log(loggedInUser, "loggedInUser")
    const options = {
        httpOnly: true,
        secure: true,
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200,
            {
                user: loggedInUser,
                accessToken,
                refreshToken

            }, "User logged in successfully"))
})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, {
        $set: {
            refreshToken: undefined,
        },
    }, {
        new: true,
    })

    const options = {
        httpOnly: true,
        secure: true,
    }

    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"))
})

const updateUser = asyncHandler(async (req, res) => {
    const { email, newEmail, password, newPassword, address, zipcode, city, country, fullName, username, dob } = req.body;
    console.log(city)
    console.log(req.params)
    const { id } = req.params;
    if (newEmail || newPassword || email || password) {

        if (!email || !newEmail || !password || !newPassword) {
            return res.status(400).json(new ApiResponse(400, {}, "To change email and password, all current and new credentials are required"));
        }

        if (email === newEmail) {
            throw new ApiResponse(404, "New email cannot be same as previous.");
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json(new ApiResponse(404, {}, "User does not exist"));
        }
        console.log("idhar aaya")

        if (password != "") {
            const isPasswordValid = await user.isPasswordCorrect(password)

            if (!isPasswordValid) {
                throw new ApiError(401, "Invalid credentials")
            }

            user.password = newPassword;
        }

        if (newEmail != "") {
            user.email = newEmail;

        } else {
            throw new ApiResponse(404, "New email is required.");
        }
        user.save({ validateBeforeSave: false })
        const userId = user._id;
        // const newUser = await UserInfo.findOne({userId});

        await UserInfo.findOneAndUpdate(
            { userId },
            {
                $set: {
                    ...(address && { address }),
                    ...(zipcode && { zipcode }),
                    ...(city && { city }),
                    ...(country && { country }),
                    ...(fullName && { fullName }),
                    ...(username && { username }),
                    ...(dob && { dob }),
                },
            },
            { new: true },
        );
        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Profile updated successfully"))

    } else if (!email && !newEmail && !password && !newPassword) {

        const userInfo = await UserInfo.findOne({ userId: id });
        if (!userInfo) {
            throw new ApiResponse(404, "User does not exist");
        }
        console.log("2nd case")
        await UserInfo.findOneAndUpdate(
            { userId: id },
            {
                $set: {
                    ...(address && { address }),
                    ...(zipcode && { zipcode }),
                    ...(city && { city }),
                    ...(country && { country }),
                    ...(fullName && { fullName }),
                    ...(username && { username }),
                    ...(dob && { dob }),
                },
            },
            { new: true },
        );
        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Profile updated successfully"))

    }



})

const getUserProfile = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) {
        throw new ApiResponse(401, "Email is required");
    }

    // Debug: Log the email received
    console.log(`Received email: ${email}`);

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
        // Debug: Log user not found
        console.log(`User not found for email: ${email}`);
        throw new ApiResponse(404, "User does not exist");
    }

    // Debug: Log user found
    console.log(`User found: ${user}`);

    // Find the user profile by user ID
    const userId = user._id;
    const userProfile = await UserInfo.findOne({ userId });
    if (!userProfile) {
        // Debug: Log user profile not found
        console.log(`User profile not found for user ID: ${user._id}`);
        throw new ApiResponse(404, "User profile does not exist");
    }

    // Debug: Log user profile found
    console.log(`User profile found: ${userProfile}`);

    return res.status(200).json(new ApiResponse(200, {}, userProfile));
});
const getParticularStockInfo = asyncHandler(async (req, res) => {
    const { question } = req.body;
    const { id } = req.params;
    if (!question || !id) {
        throw new ApiError(401, "Query is required");
    }
    const user = await UserInfo.findOne({ userId: id });
    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    const now = new Date();
    const lastResponseTime = user.lastResponseTime || new Date(0);

    // Check if the last response was on a different day
    const isSameDay =
        now.getDate() === lastResponseTime.getDate() &&
        now.getMonth() === lastResponseTime.getMonth() &&
        now.getFullYear() === lastResponseTime.getFullYear();

    if (!isSameDay) {
        user.responses = 0;
    }

    if (user.responses >= 3) {
        return res.status(400).json({
            error: "You have reached the daily limit of free responses.",
        });
    }

    const gptQuery = `Act as a stock price predictor, like user will ask you about the stock that at which point he have to buy or sell the stock or any query related to that. So in the query you will receive the last 7 days data, so on the basis of that predict the best possible case of buying and sell or hold, give response in 150 words. ${question}`;

    const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: "user", content: gptQuery }],
        model: "gpt-3.5-turbo",
    });

    if (!chatCompletion.choices || !chatCompletion.choices.length) {
        throw new ApiResponse(500, "No valid response from OpenAI");
    }

    const responseContent = chatCompletion.choices[0].message.content;

    if (responseContent) {
        user.responses += 1;
        user.lastResponseTime = now;
        await user.save({ validateBeforeSave: false });
    }

    return res.status(200).json(new ApiResponse(200, responseContent, "Response completed"));
});


const stockInfo = asyncHandler(async (req, res) => {
    const { question } = req.body;
    const { id } = req.params;
    if (!question || !id) {
        throw new ApiResponse(401, "Question is required");
    }

    const user = await UserInfo.findOne({ userId: id });
    if (!user) {
        throw new ApiError(404, "User does not exist");
    }
    const now = new Date();
    const lastResponseTime = user.lastResponseTime || new Date(0);

    const isSameDay =
        now.getDate() === lastResponseTime.getDate() &&
        now.getMonth() === lastResponseTime.getMonth() &&
        now.getFullYear() === lastResponseTime.getFullYear();

    if (!isSameDay) {
        user.responses = 0;
    }


    if (user.responses >= 3) {
        return res.status(400).json({
            error: "You have reached the daily limit of free responses.",
        });
    }

    const gptQuery = `Act as a stock market news reporter and give me the news related to the query in 100 words: ${question}`;


    const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: "user", content: gptQuery }],
        model: "gpt-3.5-turbo",
    });

    if (!chatCompletion.choices || !chatCompletion.choices.length) {
        throw new ApiResponse(500, "No valid response from OpenAI");
    }

    const responseContent = chatCompletion.choices[0].message.content;
    if (responseContent) {
        user.responses += 1;
        user.lastResponseTime = now;
        await user.save({ validateBeforeSave: false });
    }

    // Split the response content into words
    // const words = responseContent.split(' ' || '\n');
    // console.log(words)
    // Emit each word with a delay
    // for (const word of words) {
    //     setInterval(() => {
    //         io.emit('chat message', word);
    //     }, 1000)
    // }

    return res.status(200).json(new ApiResponse(200, responseContent, "Response completed"));
});

export { registerUser, loginUser, logoutUser, updateUser, getUserProfile, stockInfo, verifyOtp, getParticularStockInfo };