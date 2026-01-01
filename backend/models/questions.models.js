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

    discussion: [{
      type: Schema.Types.ObjectId,
      ref : "Discussion"
    }],

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
      type : Date,
      default : null
    },
    
  },
  { timestamps: true }
);

const Question = mongoose.model("Question", questionSchema);

export default Question;
