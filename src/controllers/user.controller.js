import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { json } from "express";

const registerUser = asyncHandler( async (req, res) => {
    // Step 1 : Get user details from your front-end or POSTMAN

    const {userName, email, fullname, password} = req.body
    

    // Step 2 : validtion - not Empty

    if (fullname === "") {
        throw new ApiError(400, "Full Name is required")
    }

    if (userName === "") {
        throw new ApiError(400, "userName is required")
    }

    if (email === "") {
        throw new ApiError(400, "email is required")
    }

    if (password === "") {
        throw new ApiError(400, "password is required")
    }

    // Step 3 : Check if user already Exists  through email or username

    const existedUserName = User.findOne({ userName })
    if (existedUserName) {
        throw new ApiError(409, "userName Already Exists ")
    }

    const existedUserEmail = User.findOne({ email })
    if (existedUserEmail) {
        throw new ApiError(409, "Email Already Exists ")
    }

    // Step 4 : Check for Images & Check for avatar

    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImgLocalPath = req.files?.coverImg[0]?.path

    // Step 5 : check avatar is successfuly uploaded

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is Necessary")
    }

    // Step 6 : if everything is okay then upload to cloudinary

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImg = await uploadOnCloudinary(coverImgLocalPath)

    if(!avatar){
        throw new ApiError(400, "Avatar file is required")
    }

    // Step 7 : create user object then make a creation call in db

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImg : coverImg?.url || "",
        email,
        password,
        userName : userName.toLowerCase()
    })

    // Step 8 : remove password & refresh token field from response

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    // Step 9 : check for user creation

    if (!createdUser) {
        throw new ApiError(500, "Registration Error")
    }

    
    // Step 10 : return response

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Registered Successfully")
    )    

} )



export { registerUser }


