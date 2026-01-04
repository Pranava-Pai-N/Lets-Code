import Question from "../models/questions.models.js"
import Discussion from "../models/discussions.models.js";
import ExpressError from "../utils/expressError.js"
import { discussionPostSchema } from "../validations/discussionPost.js"



// Creating a discussion for a question
const createDiscussion = async (req, res) => {
    try {
        const result = discussionPostSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Does not match the schema structure. Please modify it before submitting again...",
                errors: result.error.flatten()
            })
        }

        const data = result.data;

        const userId = req.user?.id || req.user?._id;

        const question = await Question.findById(data.questionId);

        if (!question) {
            return res.status(400).json({
                success: false,
                message: "Question does not exists . Please try any other question"
            })
        }

        const newDiscussion = {
            userId,
            ...data
        };

        const discussion = await Discussion.create(newDiscussion);

        await Question.findByIdAndUpdate(data.questionId, {
            $push: { discussion: discussion._id }
        });

        return res.status(201).json({
            success: true,
            message: "Discussion added successfully ...",
            newDiscussion: discussion
        })
    } catch (error) {
        console.log("Error adding discussion . Try again later : ", error);
        throw new ExpressError(500, "Internal Server Error ...")
    }
}

// Get all discussions for a given question
const getallDiscussionforaQuestion = async (req, res) => {
    try {
        const { id } = req.params;


        if (!id)
            return res.status(400).json({
                success: false,
                message: "Please provide a valid question id for retrieval of discussions"
            });

        const question = await Question.findById(id);

        if (!question)
            return res.status(400).json({
                success: false,
                message: "The following question does not exists . Please provide another questionId"
            });

        const allDiscussionIds = question.discussion;

        const discussions = await Discussion.find({
            _id: { $in: allDiscussionIds }
        }).sort({ createdAt: -1 });

        if (discussions.length === 0)
            return res.status(200).json({
                success: true,
                message: "No discussion exists on the question . Please create a new discussion"
            })

        return res.status(200).json({
            success: true,
            message: "All discussions fetched successfully ...",
            count: discussions.length,
            allDiscussions: discussions
        })

    } catch (error) {
        console.log("Error retrieving discussions for the given question.Try again later ....");
        throw new ExpressError(500, "Internal Server Error");
    }
}

const likeaDiscussion = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id)
            return res.status(400).json({
                success: false,
                message: "Please provide a valid discussion id for retrieval of discussion likes"
            });

        const userId = req.user?.id || req.user?._id;

        const discussion = await Discussion.findById(id);

        if (!discussion)
            return res.status(400).json({
                success: false,
                message: "Discussion does not exists. Please provide a valid discussion Id and try again later ..."
            });


        const isExisting = discussion.likedBy.includes(userId);

        const yourDiscussion = discussion.userId.equals(userId);

        if (yourDiscussion)
            return res.status(200).json({
                success: false,
                message: "You cannot like your discussion.."
            });

        if (isExisting)
            return res.status(200).json({
                success: false,
                message: "You have already liked this discussion."
            });


        discussion.likedBy.push(userId);

        await discussion.save();

        return res.status(200).json({
            success: true,
            message: "Discussion liked successfully",
            likeCounts: discussion.likedBy.length,
            discussion
        });

    } catch (error) {
        console.log("Error liking the discussion , try again later : ", error);
        throw new ExpressError(500, "Internal server error")
    }
}

const discussionController = {
    createDiscussion,
    getallDiscussionforaQuestion,
    likeaDiscussion
}


export default discussionController;