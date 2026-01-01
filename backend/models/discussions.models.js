import mongoose, { Schema } from "mongoose";


const discussionSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },

    questionId: {
        type: Schema.Types.ObjectId,
        ref: "Question"
    },

    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true,
    },

    likedBy: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],

    tags: [String],

    comments: [{
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }]
},
    {
        timestamps: true
    }
);



const Discussion = mongoose.model("Discussion", discussionSchema)

export default Discussion