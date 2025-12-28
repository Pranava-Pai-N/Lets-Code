import mongoose, { Schema } from "mongoose";

const pathSchema = new Schema(
  {
    questionId: {
      type: String,
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref : "User"
    },

    questionsListed: {
      type: [String],
      default: [],
    },

    companiesListed: {
      type: [String],
      default: [],
    },

    title: {
      type: String,
    },

    description: {
      type: String,
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },

    tags: {
      type: [String],
      default: [],
    },

    pathLikeCount : {
        type : Number,
        default : 0
    },

    commentsforPath : {
        type : [String],
        default : []
    }
  },
  { timestamps: true }
);

const Path = mongoose.model("Path", pathSchema);

export default Path;
