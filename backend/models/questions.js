import mongoose from "mongoose";
const { Schema } = mongoose;

/** User Schema */
const questionSchema = new Schema (
{
    question: {type: String ,  required: true},
    options: [
      {type: String,  required: true},
      {type: String,  required: true},
      {type: String,  required: true},
      {type: String,  required: true}
    ],
    correctAnswer: {type: Number,  required: true},
    subject: {type: String,  required: true}
  }
) 

export default mongoose.model("Question", questionSchema)