import User from "../models/user.models.js";
import Submissions from "../models/submissions.models.js"
import ExpressError from "../utils/expressError.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid"
import sendVerifyEmail from "../utils/EmailServices/sendVerifyEmail.js";
import jwt from "jsonwebtoken"
import sendOtpEmail from "../utils/EmailServices/otpemailpasswordforgot.js";
import { uploadtoCloudinary } from "../utils/cloudinary.js";
import { fetchLeetCodeData } from "../utils/getLeetcodeData.js";
import { geminiHelp } from "../utils/geminiHelp.js";
import { registerSchema } from "../validations/registrationValidation.js";
import { profileCompletionSchema } from "../validations/profileValidation.js";
import { forgotPasswordSchema } from "../validations/forgotPassword.js";
import { passwordResetSchema } from "../validations/passwordresetValidation.js";

const getMe = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id;

        if (!userId)
            throw new ExpressError(404, "Please provide a userId to find the user ..")

        const user = await User.findById(userId)

        if (!user)
            throw new ExpressError(404, `User does not exist with ID : ${userId}`)

        return res.status(200).json({
            success: true,
            message: "User fetched successfully",
            user: user
        });

    } catch (error) {
        console.log("Error in retrieving the user . Please try again later : ", error);
    }
}

const getallUsers = async (req, res) => {
    try {
        const allUsers = await User.find()

        if (!allUsers)
            throw new ExpressError(404, "No users exist currently . Please signup as a user or try agan")

        return res.status(200).json({
            success: true,
            allusers: allUsers
        });

    } catch (error) {
        console.log("Error in retrieving all the available users . Please try again later : ", error);
    }
}


const registerUser = async (req, res) => {
    try {
        const { data, success } = registerSchema.safeParse(req.body);

        if (!success)
            return res.status(400).json({
                success: false,
                message: "Username, email, and password are not meeting expecting format"
            });

        const existingUser = await User.findOne({ email: data.email });

        if (existingUser)
            return res.status(400).json({
                success: false,
                message: "A user with this email already exists."
            });

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const token = uuidv4();

        const newUser = {
            userName: data.userName,
            email: data.email,
            password: hashedPassword,
            profile_url: data.profileUrl,
            token: token,
            isProfileComplete: false
        };

        const createdUser = await User.create(newUser);

        createdUser.password = null;

        sendVerifyEmail(data.email, data.userName, token).catch((err) => {
            console.error("Background Email Error:", err);
        });

        return res.status(201).json({
            success: true,
            message: "Registration successful! Please verify your email.",
            user: createdUser
        });

    } catch (error) {
        console.error("Registration Error:", error);
        console.log("Error message : ", error.message)
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};

const verifyUser = async (req, res) => {
    try {
        const { token } = req.query;

        if (!token)
            return res.status(500).json({
                success: false,
                message: "Please provide a token to validate your account"
            });

        const user = await User.findOne({ token: token });

        if (!user)
            return res.status(500).json({
                success: false,
                message: "User does not exists or token is invalid ..."
            });

        if (user.isVerified)
            return res.status(200).json({
                success: true,
                message: "You are already verified. You can Login now ."
            });


        user.isVerified = true
        user.token = undefined;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "User verified successfully . Please Login now ..."
        });
    } catch (error) {
        console.log("Error verifying token from user . Try Again ...")
    }
}


const completeProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = profileCompletionSchema.safeParse(req.body)


        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required profile fields and match the required criterias, validation failed",
                errors: result.error.flatten()
            });
        }

        const data = result.data;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                age: data.age,
                languagesProficient: data.languagesProficient,
                collegeName: data.collegeName,
                targetingCompanies: data.targetingCompanies,
                socialLinks: data.socialLinks,
                interests: data.interests,
                profileCompleted: true
            },
            { new: true, select: "-password" }
        );

        return res.status(200).json({
            success: true,
            message: "Profile completed successfully!",
            user: updatedUser
        });

    } catch (error) {
        console.error("Profile Completion Error:", error);
        return res.status(500).json({ success: false, message: "Error updating profile." });
    }
};



const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email)
        return res.status(400).json({
            success: false,
            message: "Email missing for Login . Please Provide them and then login ..."
        });

    const user = await User.findOne({ email: email });

    if (!user)
        return res.status(400).json({
            success: false,
            message: "Account does not exist . Please create a new account and then login ."
        });

    if (user) {
        if (!password) {
            const token = jwt.sign({ id: user._id, email: email }, process.env.JWT_SECRET, { expiresIn: '1h' });

            res.cookie("token", token, {
                httpOnly: true,
                secure: true,
                maxAge: 24 * 60 * 60 * 1000,
                sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax',
                path: "/"
            });

            user.password = null;

            return res.status(200).json({
                success: true,
                token,
                user,
                message: `Welcome back , ${user.userName}`
            });
        }
    }
    
    if(!password){
        return res.status(400).json({
            success: false,
            message: "Password missing for Login . Please Provide them and then login ..."
        });
    }


    const isMatching = await bcrypt.compare(password, user.password);

    if (!isMatching)
        return res.status(400).json({
            success: false,
            message: "Passwords do not match.Try a new Password ."
        });

    if (!user.isVerified)
        return res.status(400).json({
            success: false,
            message: "Please verify your email before logging in ."
        });


    const token = jwt.sign({ id: user._id, email: email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax',
        path: "/"
    });

    user.password = null;

    return res.status(200).json({
        success: true,
        token,
        user,
        message: `Welcome back , ${user.userName}`
    });
}

const logoutUser = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: "/"
        });

        return res.status(200).json({
            success: true,
            message: "Logged out successfully. See you soon!"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Logged out Error . Try Again .."
        });
    }
}


const forgotPasswordwithotp = async (req, res) => {
    try {
        const result = forgotPasswordSchema.safeParse(req.body);

        if (!result.success)
            return res.status(400).json({
                success: false,
                message: "Please Provide a email to find account or validation failed"
            });

        const data = result.data;

        const user = await User.findOne({ email: data.email });

        if (!user)
            return res.status(400).json({
                success: false,
                message: "User does not exists . Please enter another email ."
            });

        if (!user.isVerified)
            return res.status(400).json({
                success: false,
                message: "User has not verified his email . Not available functionality ..."
            });

        const otp = Math.floor(1000 + Math.random() * 9000);

        user.otp = otp;
        user.otpexpiresin = new Date(Date.now() + 10 * 60 * 1000);

        await user.save();

        sendOtpEmail(user.email, user.userName, otp).catch((err) => {
            console.error("Background Email Error:", err);
        });

        return res.status(200).json({
            success: true,
            message: `A Email with OTP has been sent to ${user.email} to reset your password`
        });


    } catch (error) {
        console.log("Error changing password .");
        return res.status(404).json({
            success: false,
            message: "Error changing the password . Try Again Later ."
        });
    }
}

const handlePasswordReset = async (req, res) => {
    try {
        const result = passwordResetSchema.safeParse(req.body);

        if (!result.success)
            return res.status(400).json({
                success: false,
                message: "Please provide all required details for password reset or validation failed",
                errors: result.error.flatten()
            });

        const data = result.data;

        const user = await User.findOne({ email: data.email });

        if (!user)
            return res.status(404).json({
                success: false,
                message: "User with this email does not exists . Try with another email ..."
            });

        if (!user.otp)
            return res.status(404).json({
                success: false,
                message: "The otp has expired or your password has been already changed ."
            });

        if (Date.now() > user.otpexpiresin) {
            user.otp = undefined,
                user.otpexpiresin = undefined;
            await user.save();
            return res.status(404).json({
                success: false,
                message: "The OTP has expired . Please try again later ..."
            });
        }

        const isMatching = Number(user.otp) === Number(data.otp);


        if (!isMatching)
            return res.status(400).json({
                success: false,
                message: "The otp does not match with the sent otp. Please enter correct otp and try again .."
            });



        const isMatchingPassword = await bcrypt.compare(data.newPassword, user.password);


        if (isMatchingPassword)
            return res.status(400).json({
                success: false,
                message: "New Password cannot be same as the old password ."
            });

        const newHashPassword = await bcrypt.hash(data.newPassword, 10);

        user.password = newHashPassword;
        user.otp = undefined;
        user.otpexpiresin = undefined;

        await user.save();

        user.password = null;

        return res.status(200).json({
            success: true,
            message: "Password updated successfully . You can now login with the new passsword"
        });
    } catch (error) {
        console.log("Error verifying user . Try again Later ...");

        return res.status(500).json({
            success: false,
            message: `Error verifying and reseting users password : ${error}`
        });
    }

}


const editProfile = async (req, res) => {
    try {
        const { userName, collegeName, languagesProficient, interests, targetingCompanies, socialLinks } = req.body;

        const userId = req.user?.id;

        const user = await User.findByIdAndUpdate(userId, {
            $set: {
                userName: userName,
                collegeName: collegeName,
                languagesProficient: languagesProficient,
                interests: interests,
                targetingCompanies: targetingCompanies,
                socialLinks: socialLinks
            }
        }, {
            new: true,
            runValidators: true
        }).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found . Please try again later ."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully ...",
            updatedUser: user
        })

    } catch (error) {
        console.log("Error editing profile. Try again later ..", error);
        throw new ExpressError(400, "Error editing profile try again ...")
    }
};


const googleAuthSuccess = async (req, res) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(401).json({ success: false, message: "Authentication failed" });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax',
            path: "/"
        });


        res.redirect(`${process.env.FRONTEND_URL}/dashboard`);

    } catch (error) {
        console.error("Google Auth Error:", error);
        res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
    }
};

const githubAuthSuccess = async (req, res) => {
    try {
        const user = req.user;

        if (!user)
            return res.status(401).json({
                success: false,
                message: "Authentication failed"
            });

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );


        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax',
            path: "/"
        });

        res.redirect(`${process.env.FRONTEND_URL}/dashboard`)

    } catch (error) {
        console.log("Github Auth Error : ", error);
        res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`)
    }
}


const handleProfileURlChange = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id;

        if (!req.file)
            return res.status(400).json({
                success: false,
                message: "Please provide an image to change profile url."
            });


        const cloudinaryResponse = await uploadtoCloudinary(req.file.path, userId);

        if (!cloudinaryResponse)
            return res.status(500).json({
                success: false,
                message: "Error while uploading file to cloudinary. Please try again later"
            });

        const updatedUser = await User.findByIdAndUpdate(userId,
            {
                $set: { profile_url: cloudinaryResponse.secure_url }
            },
            { new: true }
        ).select("-password");


        res.status(200).json({
            success: true,
            message: "Profile picture updated successfully",
            user: updatedUser
        });

    } catch (error) {
        console.error("Profile URL Update Error:", error);

        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
}


const getallSubmissions = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id;

        const allSubmissions = await Submissions.find({ user: userId }).sort({ createdAt: -1 })

        if (!allSubmissions || allSubmissions.length === 0)
            return res.status(200).json({
                success: false,
                message: "User has not submitted any questions . Submit one question first ...",
                submissions: [],
                totalSubmissions: 0
            });

        return res.status(200).json({
            success: true,
            message: "All submissions fetched successfully ...",
            totalSubmissions: allSubmissions.length,
            submissions: allSubmissions
        });

    } catch (error) {
        console.log("Error retrieving submissions : ", error);
        throw new ExpressError(400, "Submission error")
    }
}


const getSubmissionbyId = async (req, res) => {
    try {
        const { submissionId } = req.params;

        if (!submissionId)
            return res.status(400).json({
                success: false,
                message: "Please provide a submissionId to search for submissions"
            });

        const userId = req.user?.id || req.user?._id;


        const submission = await Submissions.findOne({ _id: submissionId, user: userId });

        if (!submission)
            return res.status(400).json({
                success: false,
                message: "Submission does not exist for the user . Try Again later"
            });

        return res.status(200).json({
            success: true,
            message: "Submission fetched successfully",
            foundSubmission: submission
        })
    } catch (error) {
        console.log("Error retrieving submission : ", error);
        throw new ExpressError(400, "Error retrieving the submission. Try again later .")
    }
}

const getLeetCodeDatabyUsername = async (req, res) => {
    try {
        const { leetcodeUsername } = req.body;
        const userId = req.user?.id || req.user?._id;

        const user = await User.findById(userId);


        if (!user)
            return res.status(400).json({
                success: false,
                message: "User does not exists. Try again later"
            });

        if (!leetcodeUsername)
            return res.status(400).json({
                success: false,
                message: "Please provide a username to connect ..."
            });


        const userDetails = await fetchLeetCodeData(leetcodeUsername);

        if (!userDetails)
            return res.status(400).json({
                success: false,
                message: "User Profile does not exists. Try again later ..."
            });

        user.leetcodeUsername = leetcodeUsername;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Profile details retrieved successfully",
            data: userDetails
        })
    } catch (error) {
        console.log("Error getting data from leetcode : ", error);
        throw new ExpressError(400, "Error retrieving profile from leetcode");
    }
}


const getRecentActivity = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id;

        const recentSubmissions = await Submissions.find({ user: userId }).sort({ createdAt: -1 }).limit(5);

        if (!recentSubmissions)
            return res.status(400).json({
                success: false,
                message: "Failed to fetch recent submissions of user since he has not submitted anything"
            });

        return res.status(200).json({
            success: true,
            message: "Recent activity retrieved successfully..",
            submissionCount: recentSubmissions.length,
            activity: recentSubmissions
        })
    } catch (error) {
        console.log("Error retrieving user's recent activity. Try Again Later ...");
        throw new ExpressError(400, "Error retrieving user's recent activity.")
    }
}

const getGeminiHelp = async (req, res) => {
    try {
        const { source_code, problem } = req.body;

        const stream = await geminiHelp(source_code, problem); // Streaming of data


        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Transfer-Encoding', 'chunked');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Content-Type-Options', 'nosniff');

        for await (const chunk of stream) {
            try {
                const chunkText = chunk.text;
                if (chunkText) {
                    res.write(chunkText)
                }
            } catch (error) {
                console.log(error);
                continue;
            }
        }
        res.end();

    } catch (error) {
        console.log("Error from Gemini. Try again later ...");
        if (!res.headersSent) {
            res.status(500).json({ success: false, message: "Internal AI Error" });
        } else {
            res.end();
        }
    }

}

const userController = {
    getMe,
    getallUsers,
    registerUser,
    completeProfile,
    editProfile,
    verifyUser,
    loginUser,
    logoutUser,
    forgotPasswordwithotp,
    handlePasswordReset,
    googleAuthSuccess,
    githubAuthSuccess,
    handleProfileURlChange,
    getallSubmissions,
    getSubmissionbyId,
    getLeetCodeDatabyUsername,
    getRecentActivity,
    getGeminiHelp
};

export default userController;