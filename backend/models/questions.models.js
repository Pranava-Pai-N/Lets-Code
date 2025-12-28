import mongoose, { Schema } from "mongoose";

const questionSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    difficultyLevel: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },

    testCases: [
      {
        input: { type: String, required: true },
        output: { type: String, required: true },
      }
    ],

    topicsList: {
      type: [String],
      default: [],
    },

    ratingLevel: {
      type: Number,
      min: 1,
      max: 5,
      default: 1,
    },

    difficultyRating : {
        type : Number,
        min : 1,
        max : 100,
        required : true
    },

    constraints: {
      type: [String], 
      default: [],
    },

    discussion: {
      type: [
        {
          userId: { type: mongoose.Schema.Types.ObjectId , ref : "User"},
          comment: { type: String, required: true },
          postedAt: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },

    solvedBy: {
      type: [String], 
      default: [],
    },

    expectedTimeComplexity :{
        type : String,
        required : true
    },

    expectedSpaceComplexity :{
        type : String,
        required : true
    },

    acceptedRate: {
      type: Number,
      default: 0,
    },

    isDailyQuestion : {
      type : Boolean,
      default : false
    },

    validTill : {
      type : String,
      default : ""
    },
    
  },
  { timestamps: true }
);

const Question = mongoose.model("Question", questionSchema);

export default Question;
