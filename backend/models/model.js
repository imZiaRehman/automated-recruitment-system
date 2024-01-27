import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  requirements: { type: String, required: true },
  cgpaWeightage: { type: Number, required: true },
  universityWeightage: { type: Number, required: true },
  skillsWeightage: { type: Number, required: true },
  similarityScoreWeightage:  { type: Number, required: true },
  highestEducationBonusWeightages :  { type: Number, required: true },
  workExperienceWeightage: { type: Number, required: true },
  deadline: { type: Date, required: true },
  testDeadline: { type: Date, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  seats: { type: Number, required: true }
});

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  university: { type: String },
  cgpa: { type: Number },
  skills: [{ type: String }],
  workExperience: { type: Number },
  dob: {type: String},
  phone: { type: String }
});

const questionSchema = new mongoose.Schema({
    question: {type: String ,  required: true},
    options: [
      {type: String,  required: true},
      {type: String,  required: true},
      {type: String,  required: true},
      {type: String,  required: true}
    ],
    correctAnswer: {type: Number,  required: true},
    subject: {type: String,  required: true},
});

const testSchema = new mongoose.Schema({
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  deadline: { type: Date, required: true },
});

const jobApplicationSchema = new mongoose.Schema({
  candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true },
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  test: { type: mongoose.Schema.Types.ObjectId, ref: 'Test' },
  score: {type: Number, required: true},
  test_score:{type: Number, required: true},
  status: { type: String, required: true },
  tabSwitch:{type: Number, required: true}
});

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now, expires: 600 } // OTP expires after 10 minutes (600 seconds)
});

const OTP = mongoose.model('OTP', otpSchema);
const Job = mongoose.model('Job', jobSchema);
const Admin = mongoose.model('Admin', adminSchema);
const Candidate = mongoose.model('Candidate', candidateSchema);
const Question = mongoose.model('Question', questionSchema);
const Test = mongoose.model('Test', testSchema);
const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);

export { Job, Admin, Candidate, Question, Test, JobApplication, OTP };
