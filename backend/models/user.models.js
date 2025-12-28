import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
    },

    age: {
      type: Number,
      required: true,
      default: 0
    },

    languagesProficient: {
      type: [String],
      default: [],
    },

    collegeName: {
      type: String,
      default: ""
    },

    targetingCompanies: {
      type: [String],
      default: [],
      required: true
    },

    socialLinks: {
      github: { type: String },
      linkedin: { type: String },
      twitter: { type: String },
      portfolio: { type: String },
    },

    solvedQuestionCount: {
      type: Number,
      default: 0,
    },

    solvedQuestionIds: {
      type: [String],
      default: [],
    },

    currentStreak: {
      type: Number,
      default: 0
    },

    maximumStreak: {
      type: Number,
      default: 0
    },

    allSubmissions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref : "Submissions"
    },
  ],


    pathId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Path"
    },

    interests: {
      type: [String],
      default: [],
    },

    email: {
      type: String,
      required: true
    },

    password: {
      type: String,
    },

    token: {
      type: String,
    },

    isVerified: {
      type: Boolean,
      required: true,
      default: false
    },

    acceptance_rate: {
      type: Number,
      required: true,
      default: 0.0
    },

    correct_submissions: {
      type: Number,
      default: 0,
      required: true
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      required: true,
      default: "user"
    },

    otp: {
      type: Number,
      default: null
    },

    otpexpiresin: {
      type: String,
      default: null
    },

    profileCompleted: {
      type: Boolean,
      default: false
    },

    googleId: {
      type: String,
      default: ""
    },

    githubId: {
      type: String,
      default: ""
    },

    profile_url: {
      type: String,
      default: ""
    },

    leetcodeUsername : {
      type : String,
      default : "",
    }

  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
