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
        type : Schema.Types.ObjectId,
        ref : "Comment"
    }],
},
    {
        timestamps: true
    })


const Comment = mongoose.model("Comment", commentSchema);

export default Comment;