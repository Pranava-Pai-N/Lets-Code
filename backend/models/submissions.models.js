import mongoose, { Schema } from "mongoose";


const submissionSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    problem: {
        type: Schema.Types.ObjectId,
        ref: "Question",
        required: true
    },

    sourceCode: {
        type: String,
        required: true
    },

    languageId: {
        type: Number,
        required: true
    },

    status: {
        type: String,
        enum: ["Accepted", "Wrong Answer", "Runtime Error", "Time Limit Exceeded", "Compile Error", "Pending"],
        default: "Pending"
    },

    testResults: [{
        testCaseId: Schema.Types.ObjectId,
        passed: Boolean,
        stdout: String,
        stderr: String,
        time: String,   
        memory: Number, 
        status: String  
    }],


    totalRuntime: {
        type: String, 
        default: "0"
    },

    totalMemory: {
        type: Number, 
        default: 0
    },

    finalSubmission :{
        type : Boolean,
        default : false,
        required : true
    },

    question_title :{
        type : String, 
        required : true
    }
    
},
    { timestamps: true })

submissionSchema.index({ user: 1, problem: 1 })

const Submissions = mongoose.model("Submissions", submissionSchema);

export default Submissions;