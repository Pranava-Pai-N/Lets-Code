import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema({
    discussionId: {
        type: Schema.Types.ObjectId,
        ref: "Discussion"
    },

    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },

    text: {
        type: String,
        required: true
    },

    likedBy: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],

    replies: [{
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
    }],
},
    {
        timestamps: true
    })


const Comment = mongoose.model("Comment", commentSchema);

export default Comment;