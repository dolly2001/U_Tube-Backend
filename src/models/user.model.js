import mongoose, { Schema, mongo } from "mongoose";
import { Jwt } from "jsonwebtoken";
import bcrypt from "bcrypt"


const userSchema = new Schema({

    userName : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true,
        index : true
    },

    email : {
        type : String,
        required : true,
        lowercase : true,
        unique : true,
        trim : true
    },

    fullname : {
        type : String,
        required : true,
        trim : true,
        index : true
    },

    avatar : {
        type : String, 
        required : true
    },

    coverImg : {
        type : String,
    },

    watchHistory : [
        {
            type : Schema.Types.ObjectId,
            ref : "Video"
        }
    ],

    password : {
        type : String,
        required : [true, "Password is Required"]
    },

    refreshToken : {
        type : String
    }

}, {timestamps : true})

userSchema.pre("save", async function (next) {

    if (!this.isModified("password")) return next();

    this.password = bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password){
   return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
   return Jwt.sign(
        { 
            _id : this._id,
            email : this.email,
            userName : this.userName,
            fullname : this.fullname
        },
        process.env.ACCESS_TOKEN_SECRETE,{
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id : this._id
        },
        process.env.REFRESH_TOKEN_SECRETE,{
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)