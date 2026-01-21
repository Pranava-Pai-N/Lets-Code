import axios from "axios";
import Question from "../models/questions.models.js";
import ExpressError from "../utils/expressError.js";
import User from "../models/user.models.js";
import Submissions from "../models/submissions.models.js";
import dotenv from "dotenv";
import Notification from "../models/notifications.models.js";

dotenv.config();


const getAllQuestions = async (req, res) => {
    try {
        const allQuestions = await Question.find().sort({ isDailyQuestion: -1, createdAt: -1 });

        if (!allQuestions)
            return res.status(404).json({
                success: false,
                message: "Questions not available add questions first ..."
            })

        return res.status(200).json({
            success: true,
            message: "All Questions retrieved suceessfully ..",
            questions: allQuestions
        })

    } catch (error) {
        console.log("Error retrieving all the questions . Try again .. ", error)
    }
}

const isDailyQuestion = async (questionId) => {
    try {
        if (!questionId)
            throw new ExpressError(404, "Please provide a question Id");

        const question = await Question.findById(questionId);

        if (!question)
            return res.status(404).json({
                success: false,
                message: "Question not found . Please try again ."
            })

        const isDaily = question.isDailyQuestion;

        return isDaily;

    } catch (error) {
        console.log("Error in retrieving daily question or not : ", error);
    }
}

const addQuestion = async (req, res) => {
    try {
        const {
            title,
            description,
            difficultyLevel,
            testCases,
            topicsList,
            ratingLevel,
            difficultyRating,
            constraints,
            discussion,
            solvedBy,
            expectedTimeComplexity,
            expectedSpaceComplexity,
            acceptedRate,
            isDailyQuestion
        } = req.body;

        console.log(req.body);


        if (
            !title ||
            !description ||
            !difficultyRating ||
            !expectedTimeComplexity ||
            !expectedSpaceComplexity
        ) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields",
            });
        }

        const newQuestion = await Question.create({
            title,
            description,
            difficultyLevel,
            testCases,
            topicsList,
            ratingLevel,
            difficultyRating,
            constraints,
            discussion,
            solvedBy,
            expectedTimeComplexity,
            expectedSpaceComplexity,
            acceptedRate,
            isDailyQuestion,
        });

        return res.status(201).json({
            success: true,
            message: "Question added successfully",
            data: newQuestion,
        });

    } catch (error) {
        console.error("Error adding question:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

const getQuestionById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id)
            return res.status(404).json({
                success: false,
                message: "Please Provide an Id .. "
            })

        const question = await Question.findById(id);

        if (!question)
            return res.status(404).json({
                success: false,
                message: "Question does not exists .."
            })

        return res.status(200).json({
            success: true,
            message: "Question retrieved successfully ...",
            question: question
        })
    } catch (error) {
        return res.status(404).json({
            success: false,
            error: error,
            message: "Error retrieving question .. Try Again .."
        })
    }
}


const runaQuestion = async (req, res) => {
    try {
        const { question_no, source_code, language_id, test_cases } = req.body;

        const userId = req.user?.id || req.user?._id;


        const recentSubmission = await Submissions.findOne({
            user: userId,
            problem: question_no,
            createdAt: { $gt: new Date(Date.now() - 5000) }
        });

        if (recentSubmission) {
            return res.status(429).json({
                success: false,
                message: "Please wait a moment before running again."
            });
        }

        if (!source_code || !language_id || !test_cases) {
            return res.status(400).json({
                success: false,
                message: "Source code, language ID, or test cases are missing."
            });
        }

        const [user, questionData] = await Promise.all([
            User.findById(userId),
            Question.findById(question_no)
        ]);


        if (!user || !questionData) {
            return res.status(404).json({
                success: false,
                message: "User or Question not found"
            });
        }

        const submissionUrl = `${process.env.JUDGE0_URL}/submissions?base64_encoded=false&wait=true`;


        const results = await Promise.all(test_cases.map(async (test) => {
            const body = {
                source_code: source_code,
                language_id: language_id,
                stdin: test.input,
                expected_output: test.output,
                cpu_time_limit: 2.0,
                memory_limit: 512000
            };

            const response = await axios.post(submissionUrl, body);

            return {
                test_case_id: test._id,
                passed: response.data.status.id === 3,
                status: response.data.status.description,
                stdout: response.data.stdout ? response.data.stdout.trim() : null,
                stderr: response.data.stderr,
                time: response.data.time,
                memory: response.data.memory
            };
        }));

        const allPassed = results.every(r => r.passed);


        const newsubmission = await Submissions.create({
            user: userId,
            problem: question_no,
            sourceCode: source_code,
            languageId: language_id,
            status: allPassed ? "Accepted" : "Wrong Answer",
            testResults: results,
            totalRuntime: results[0]?.time || "0",
            totalMemory: results[0]?.memory || 0,
            finalSubmission: false,
            question_title: questionData.title
        });

        await User.findByIdAndUpdate(userId, {
            $push: { allSubmissions: newsubmission._id }
        });

        return res.status(200).json({
            success: true,
            allPassed,
            submission_id: newsubmission._id,
            results
        });

    } catch (error) {
        console.error("Error in runaQuestion:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
};


const submitaQuestion = async (req, res) => {
    try {
        const { question_no, source_code, language_id, test_cases } = req.body;

        const userId = req.user?.id || req.user?._id;


        const [user, questionData] = await Promise.all([
            User.findById(userId),
            Question.findById(question_no)
        ]);

        if (!user || !questionData) {
            return res.status(404).json({ success: false, message: "User or Question not found" });
        }

        const submissionUrl = `${process.env.JUDGE0_URL}/submissions?base64_encoded=false&wait=true`;

        const results = await Promise.all(test_cases.map(async (test) => {
            const body = {
                source_code,
                language_id,
                stdin: test.input,
                expected_output: test.output,
                cpu_time_limit: 2.0,
                memory_limit: 512000
            };

            const response = await axios.post(submissionUrl, body);
            return {
                test_case_id: test._id,
                passed: response.data.status.id === 3,
                status: response.data.status.description,
                stdout: response.data.stdout?.trim() || null,
                time: response.data.time,
                memory: response.data.memory
            };
        }));

        const allPassed = results.every(r => r.passed);

        const newSubmission = await Submissions.create({
            user: userId,
            problem: question_no,
            sourceCode: source_code,
            languageId: language_id,
            status: allPassed ? "Accepted" : "Wrong Answer",
            testResults: results,
            totalRuntime: results[0]?.time || "0",
            totalMemory: results[0]?.memory || 0,
            finalSubmission: true,
            question_title: questionData.title
        });

        let updateFields = {
            $push: { allSubmissions: newSubmission._id }
        };

        if (!allPassed) {
            return res.status(400).json({
                success: false,
                message: "Please pass all test cases to submit your code"
            })
        }

        if (allPassed) {
            const questionIdString = question_no.toString();
            const alreadySolved = user.solvedQuestionIds.map(id => id.toString()).includes(questionIdString);

            updateFields.$inc = { correct_submissions: 1 };

            if (!alreadySolved) {
                updateFields.$push.solvedQuestionIds = questionIdString;
                updateFields.$inc.solvedQuestionCount = 1;

                if (questionData.isDailyQuestion && questionData.validTill > Date.now()) {
                    updateFields.$inc.currentStreak = 1;
                }
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateFields,
            { new: true }
        );

        const totalAttempts = updatedUser.allSubmissions.length;
        updatedUser.acceptance_rate = totalAttempts > 0
            ? Math.round((updatedUser.correct_submissions / totalAttempts) * 100)
            : 0;

        if (allPassed && questionData.isDailyQuestion) {
            updatedUser.maximumStreak = Math.max(
                updatedUser.maximumStreak || 0,
                updatedUser.currentStreak || 0
            );
        }

        await updatedUser.save();

        return res.status(200).json({
            success: true,
            message: "Accepted. 100% test cases passed.",
            status: allPassed ? "Accepted" : "Rejected",
            allPassed,
            results,
            userStats: {
                solvedCount: updatedUser.solvedQuestionCount,
                streak: updatedUser.currentStreak,
                acceptanceRate: updatedUser.acceptance_rate
            }
        });

    } catch (error) {
        console.error("Submission Error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

const makeaDailyQuestion = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) 
            return res.status(400).json({ 
                success: false, 
                message: "Please provide question id in the params" 
            });

        const url = `${process.env.FRONTEND_URL}/problems/${id}`

        const io = req.app.get("io");


        await Question.updateMany({ isDailyQuestion: true }, { isDailyQuestion: false, validTill: "" });

        const question = await Question.findById(id);

        if (!question) 
            return res.status(404).json({ 
                success: false, 
                message: "Question not found please try again later." 
            });

        const messageBody = {
            message : "Problem of the day updated successfully",
            link : url,
            added_on : new Date()
        }

        const notification = await Notification.create({
            message : messageBody.message,
            link : url,
            added_on : new Date()
        })

        question.isDailyQuestion = true;
        question.validTill = Date.now() + (24 * 60 * 60 * 1000);

        await question.save();

        io.emit("potd-notification",messageBody);

        return res.status(200).json({
            success: true,
            message: "Daily question updated successfully.",
            notifcation : notification
        });

    } catch (error) {
        console.error("Error setting daily question:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
const questionController = {
    getAllQuestions,
    isDailyQuestion,
    addQuestion,
    getQuestionById,
    runaQuestion,
    submitaQuestion,
    makeaDailyQuestion
};

export default questionController;