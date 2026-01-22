import Comment from "../models/comments.models.js";
import Discussion from "../models/discussions.models.js";
import { commentSchema } from "../validations/addCommentValidation.js";
import ExpressError from "../utils/expressError.js";
import { commentreplySchema } from "../validations/commentReplyValidation.js";
import isValidObjectId from "../utils/isValidObjectId.js";


// Add a comment under a given discussion
const addaComment = async (req, res) => {
    try {
        const result = commentSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Does not match the schema structure. Please modify it before submitting again...",
                errors: result.error.flatten()
            })
        }


        const userId = req.user?.id || req.user?._id;
        const data = result.data;

        const discussion = await Discussion.findById(data.discussionId);

        if (!discussion)
            return res.status(400).json({
                success: false,
                message: "The discussion does not exists . Please try any other discussion"
            })

        const newCommentBody = {
            discussionId: data.discussionId,
            userId,
            text: data.comment
        }

        const newComment = await Comment.create(newCommentBody);

        await Discussion.findByIdAndUpdate(data.discussionId, {
            $push: { comments: newComment._id }
        });

        return res.status(201).json({
            success: true,
            message: "Comment added successfully ...",
            newComment: newComment
        });

    } catch (error) {
        console.log("Error adding comment . Try again later : ", error);
        throw new ExpressError(500, "Internal Server Error ...")
    }
}

// Get all comments for a given discussion
const getallCommentsforaDiscussion = async (req, res) => {
    try {
        const { id } = req.params;


        if (!id)
            return res.status(400).json({
                success: false,
                message: "Please provide a valid discussion id for retrieval of comments"
            });

        const isValid = isValidObjectId(id);

        if(!isValid)
            return res.status(404).json({
                success: false,
                message: "Please Provide a valid discussion id ..."
            })

        const discussion = await Discussion.findById(id);

        if (!discussion)
            return res.status(400).json({
                success: false,
                message: "The following discussion does not exists . Please provide another discussionId"
            });

        const allCommentIds = discussion.comments;

        const comments = await Comment.find({
            _id: { $in: allCommentIds }
        }).sort({ createdAt: -1 });

        if (comments.length === 0)
            return res.status(200).json({
                success: true,
                message: "No comment exists on the discussion . Please create a new comment"
            })

        return res.status(200).json({
            success: true,
            message: "All comments fetched successfully ...",
            count: comments.length,
            allComments: comments
        })

    } catch (error) {
        console.log("Error retrieving comments for the given discussion.Try again later ....");
        throw new ExpressError(500, "Internal Server Error");
    }
}

const likeaComment = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id)
            return res.status(400).json({
                success: false,
                message: "Please provide a valid comment id for retrieval of comment likes"
            });

        const isValid = isValidObjectId(id)
        
        if(!isValid)
            return res.status(404).json({
                success: false,
                message: "Please Provide a valid comment id .."
            })

        const userId = req.user?.id || req.user?._id;

        const comment = await Comment.findById(id);

        if (!comment)
            return res.status(400).json({
                success: false,
                message: "Comment does not exists. Please provide a valid comment Id and try again later ..."
            });

        
        if (comment.userId.equals(userId))
            return res.status(200).json({
                success: true,
                message: "You cannot like your post . Please like other's post"
            });

        const isExisting = comment.likedBy.includes(userId);

        if (isExisting)
            return res.status(200).json({
                success: true,
                message: "You have already liked this comment."
            });

        comment.likedBy.push(userId);

        await comment.save();

        return res.status(200).json({
            success: true,
            message: "Comment liked successfully",
            likeCounts: comment.likedBy.length,
            comment
        });

    } catch (error) {
        console.log("Error liking the comment , try again later : ", error);
        throw new ExpressError(500, "Internal server error")
    }
}

const addreplytoaComment = async (req, res) => {
    try {
        const result = commentreplySchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Does not match the schema structure. Please modify it before submitting again...",
                errors: result.error.flatten()
            })
        }

        const data = result.data;

        const parentcomment = await Comment.findById(data.parentCommentId);

        if (!parentcomment)
            return res.status(400).json({
                success: false,
                message: "The comment does not exists .."
            });

        const userId = req.user?.id || req.user?._id;

        const newReply = {
            discussionId: parentcomment.discussionId,
            userId,
            text: data.text,
        }

        const newComment = await Comment.create(newReply);

        await Comment.findByIdAndUpdate(data.parentCommentId, {
            $push: { replies: newComment._id }
        });

        return res.status(201).json({
            success: true,
            message: "Reply added successfully to the comment",
            reply: newComment
        });

    } catch (error) {
        console.log("Error replying to a comment ... ", error);
        throw new ExpressError(500, "Internal Server Error");
    }
}

const commentController = {
    addaComment,
    getallCommentsforaDiscussion,
    likeaComment,
    addreplytoaComment
}

export default commentController