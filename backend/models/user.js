import mongoose from "mongoose";
const { Schema } = mongoose;

/** User Schema */
const userSchema = new Schema ({
        username: {type: String, required: true},
        password: {type: String, required: true},
        
        tests: [
          {
            testName: {type: String},
            date: {type: Date},
            score: {type: Number},
            totalMarks: {type: Number},
            validUntill: {type: Date}
          }
        ]
})

export default mongoose.model("User", userSchema)