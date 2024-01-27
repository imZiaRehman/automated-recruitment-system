import { Job, Admin, Candidate, Question, Test, OTP, JobApplication } from "../models/model.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import axios from 'axios';
import multer from 'multer';
import nodemailer from 'nodemailer';

/** Return user his profile after athenticating his Token */
export async function getProfile(req, res) {
    // Get the user object from the request object
    console.log(req.user);
    const userData = {
        username: req.user.name,
        email: req.user.email,
    };
    console.log(userData);
    res.json(userData);
}

/** Sign In For Candidate */
export async function signUpCandidateForJobWebsite(req, res) {
    try {
        const { email, name, password } = req.body;
        // check if user already exists

        const userExists = await Candidate.findOne({ email });
        if (userExists) {
            return res.status(409).json({ message: 'Email already exists' });
        }

        // hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create a new user object
        const newCandidate = new Candidate({
            name: name,
            email: email,
            password: hashedPassword,
            university: null,
            cgpa: 0,
            skills: [],
            workExperience: 0
        });

        // save the new user to the database
        await newCandidate.save();

        res.json({ message: 'Candidate created successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

/** Admin SignIn */
export async function signInCandidateForJobWebsite(req, res) {
    try {
        const { email, password } = req.body;

        // find the admin with the given email
        const user = await Candidate.findOne({ email });
        console.log("Login Information: ");
        console.log(email, password);
        // check if the admin exists
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // compare the entered password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);

        // check if the password matches
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Create a JWT token
        const token = jwt.sign({ user }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        res.json({
            message: 'Login Successfully.',
            token: token,
            status: true
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Create a Multer storage object
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

// Create a Multer upload object
const upload = multer({ storage: storage });

/** Apply to Job Schema */
export async function applyToJob(req, res) {
    try {
        upload.single("pdf")(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                // Multer error handling
                console.error(err);
                return res.status(500).json({ message: 'Error uploading PDF file' });
            } else if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Error uploading PDF file' });
            }
        });

        const jobId = req.params.jobId;
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        console.log(req.body);
        console.log(req.file);

        const { email } = await req.body;
        console.log(email);

        // find the admin with the given email
        const candidate = await Candidate.findOne({ email: email });
        console.log(candidate);
        if (!candidate) {
            console.log("No Email Provided \n");
        }
        if (!req.file) {
            console.log("No resume provided\n");
            return res.status(400).json({ message: "No Cv Provided" });
        }

        // Check if the candidate has already applied to the job
        const existingApplication = await JobApplication.findOne({ candidate: candidate._id, job: job._id });
        if (existingApplication) {
            return res.status(200).json({ message: "You already applied to this job" });
        }

        const jobDescription = job.description;
        const filePath = req.file.path;

        const responce = axios.post('http://127.0.0.1:8000/uploadfile', {
            description: jobDescription,
            filepath: filePath,
            cgpaWeightage: job.cgpaWeightage,
            universityWeightage: job.universityWeightage,
            skillsWeightage: job.skillsWeightage,
            similarityScoreWeightage: job.similarityScoreWeightage,
            highestEducationBonusWeightages: job.highestEducationBonusWeightages,
            workExperienceWeightage: job.workExperienceWeightage
        })

        candidate.university = (await responce).data.university;
        candidate.cgpa = (await responce).data.cgpa;
        candidate.skills = (await responce).data.skills;
        candidate.workExperience = (await responce).data.workExperience;
        candidate.phone = (await responce).data.phone;
        await candidate.save();
        console.log((await responce).data);
        //Creating a new job application with the score
        const jobApplication = new JobApplication({
            candidate: candidate._id,
            job: job._id,
            score: (await responce).data.score,
            test_score: -1,
            status: "Pending",
            tabSwitch: 0
        });
        await jobApplication.save();

        // Send email to the user
        const transporter = nodemailer.createTransport({
            // Configure your email provider details here
            service: 'gmail',
            auth: {
                user: 'applicationstatus01@gmail.com',
                pass: 'svljqlfxzccyrudg'
            }
        });

        const mailOptions = {
            from: 'applicationstatus01@gmail.com',
            to: candidate.email, // Send email to the candidate's email address
            subject: 'Job Application Submitted',
            text: `Dear ${candidate.name},

We hope this email finds you well.
  
We would like to inform you that your application for the ${job.title} position has been successfully submitted. Thank you for taking the time to apply and express your interest in joining our team.
  
Here are a few important details regarding the application process:
  
1. Application Confirmation: Your application has been received and will undergo a thorough review. We appreciate your patience during this process.
  
2. Further Communication: We will be communicating with you primarily through email and our online candidate portal. Please ensure that the email address you provided during the application is accurate and regularly checked.
  
3. Application Status Updates: We understand that you are eager to know the status of your application. We will keep you informed throughout the selection process and notify you of any updates or changes.
  
4. Interview and Assessment: If your application meets our initial requirements, we may reach out to you to schedule an interview or request further assessments. Please be prepared to showcase your skills, experience, and qualifications.
              
We appreciate your interest in our organization and the time you have taken to apply. 
  
Once again, thank you for considering us as your potential employer. We wish you the best of luck with your application and look forward to reviewing it.
  
  `
        };


        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                // Handle error while sending email
            } else {
                console.log('Email sent:', info.response);
                // Email sent successfully
            }
        });

        return res.status(200).json({
            message: "Job application created",
            applicationData: candidate, // Include the extracted information in the response
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function updateFeatures(req, res) {
    try {
        const { email, university, cgpa, phone, skills } = req.body;
        const candidate = await Candidate.findOneAndUpdate(
            { email },
            { university, cgpa, phone, skills },
            { new: true }
        );

        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }

        return res.status(200).json({ message: 'Candidate updated successfully', candidate });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export async function getoneJobs(req, res) {
    try {
        const { id } = req.params; // Retrieve the id parameter from req.params
        const job = await Job.findById(id); // Use findById instead of find

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        return res.json(job);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
}



export async function getJobApplicationStatus(req, res) {
    try {
        console.log(req.query);
        const { email } = req.query;
        console.log(email);
        // Find all job applications for the given candidate email
        const jobApplications = await JobApplication.find()
            .populate({ path: 'candidate', match: { email } })
            .populate('job', 'title');


        // Filter out job applications where candidate email doesn't match
        const filteredApplications = jobApplications.filter((application) => application.candidate !== null);


        console.log(filteredApplications)
        // Extract the job application name and status
        const jobApplicationStatus = filteredApplications.map((application) => ({
            jobName: application.job.title,
            status: application.status,
        }));

        res.status(200).json({ jobApplicationStatus });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
}

export async function getAllJobApplications(req, res) {
    try {
        const jobApplications = await JobApplication.find()
            .populate('candidate', 'name email skills cgpa workExperience university')
            .populate('job', 'title');

        const result = jobApplications.map((jobApplication) => {
            const { candidate, job, score } = jobApplication;
            const { name, email, skills, cgpa, workExperience, university } = candidate;
            const { title } = job;

            return {
                name,
                email,
                skills,
                cgpa,
                workExperience,
                university,
                title,
                score,
            };
        });

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
}


/** Get all the Active jobs */
export async function getActiveJobs(req, res) {
    try {
        const activeJobs = await Job.find({ deadline: { $gt: new Date() } }).populate('createdBy', 'name');
        if (!activeJobs.length) {
            return res.status(404).json({ message: "No active jobs found" });
        }
        return res.status(200).json(activeJobs);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function updatePassword(req, res) {
    const { currentPassword, newPassword, email } = req.body;

    try {
        // Find the user by email
        const user = await Candidate.findOne({ email });

        // Check if the user exists
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare the current password with the hashed password in the database
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

        // If the current password is not valid, return an error response
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid current password' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password with the new hashed password
        user.password = hashedPassword;

        // Save the updated user in the database
        await user.save();

        // Return a success response
        return res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error updating password' });
    }
}


// Assuming you have the `transporter` configuration as mentioned in your question
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'applicationstatus01@gmail.com',
        pass: 'svljqlfxzccyrudg'
    }
});

export async function ForgotPassword(req, res) {
    const { email } = req.body;
    try {
        // Check if the email exists in the local storage or database
        const user = await Candidate.findOne({ email });

        if (!user) {
            // Email does not exist, send back an error message
            return res.status(404).json({ success: false, message: 'Email not found.' });
        }

        // Delete any previous OTP entry with the same email
        await OTP.deleteMany({ email });

        // Generate a random OTP (6-digit number)
        const otp = Math.floor(100000 + Math.random() * 900000);

        // Create a new OTP document
        const newOTP = new OTP({
            email,
            otp
        });

        // Save the OTP in the database
        await newOTP.save();

        // Compose the email message
        const mailOptions = {
            from: 'applicationstatus01@gmail.com',
            to: email,
            subject: 'OTP Verification',
            text: `Your OTP is: ${otp}`
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        // Return the OTP to the client or perform any additional logic
        res.status(200).json({ success: true, message: 'OTP sent successfully.', otp });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to send OTP.' });
    }
}

export async function verifyOTP(req, res) {
    const { email, otp } = req.body;
    try {
        // Find the OTP document for the given email
        const otpDocument = await OTP.findOne({ email });

        if (!otpDocument) {
            return res.status(404).json({ success: false, message: 'OTP not found.' });
        }
        console.log(otpDocument.otp, otp);
        if (otpDocument.otp == otp) {
            return res.status(200).json({ success: true, message: 'OTP verification successful.' });
        }

        // OTP is not valid, 
        return res.status(400).json({ success: false, message: 'Invalid OTP.' });


    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ success: false, message: 'Failed to verify OTP.' });
    }
}


export async function resetPassword(req, res) {
  const { email, password } = req.body;
  console.log(email, password);
  try {
    // Find the user with the specified email
    const user = await Candidate.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password reset successful.' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Failed to reset password.' });
  }
}
