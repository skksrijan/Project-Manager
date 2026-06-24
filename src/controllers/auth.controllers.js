import {User} from "../models/user.models.js" ;
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import {emailVerificationMailgenContent, sendEmail} from "../utils/mail.js" ;

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId) 
        const accessToken = await user.generateAccessToken() ;
        const refreshToken = await user.generateRefreshToken() ;

        user.refreshToken = refreshToken ;
        await user.save({validateBeforeSave: false}) ;
        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Failed to generate tokens") ;
    }
}

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, role } = req.body;

  const existedUser = await User.findOne({
    $or: [{username, email}]
  })

  if(existedUser){
    throw new ApiError(409, "User with email/username already exists",[])
  }

  const user = await User.create({
    email,
    username,
    password,
    isEmailVerified: false,
  })

  const { unhashedToken, hashedToken, tokenExpiry } = user.generateTemporaryToken() ;

  user.emailVerificationToken = hashedToken ;
  user.emailVerificationExpiry = tokenExpiry ;

  await user.save({validateBeforeSave: false}) ;

  await sendEmail({
    email: user.email,
    subject: "Email for verification",
    mailgenContent: emailVerificationMailgenContent(
        user.username,
        `${req.protocol}://${req.get("host")}/api/v1/users/
        verify-email/${unhashedToken}`,
    ),

  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
  )

  if(!createdUser){
    throw new ApiError(500, "Something went wrong while creating user", [])
  }
  return res
    .status(201)
    .json(
        new ApiResponse(
            200,
            {user: createdUser},
            "User created successfully, verifiaction email sent on the given email :)",
        ),
    );

});

export {registerUser} ;