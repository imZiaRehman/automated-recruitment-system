import { Job, Admin, Candidate, Question, Test, JobApplication } from "../models/model.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import axios from 'axios';
import multer from 'multer';
import fs from 'fs';
import nodemailer from 'nodemailer';

//Admin Controllers

/** Admin SingUp */
export async function SignUpAdmin(req, res) {
    try {
        const { email, name, password } = req.body;
        // check if user already exists

        const userExists = await Admin.findOne({ email });
        if (userExists) {
            return res.status(409).json({ message: 'Admin already exists' });
        }

        // hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create a new user object
        const newAdmin = new Admin({
            name: name,
            email: email,
            password: hashedPassword
        });

        // save the new user to the database
        await newAdmin.save();

        res.json({ message: 'Admin created successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

/** Admin SignIn */
export async function signInAdmin(req, res) {
    try {
        const { email, password } = req.body;

        // find the admin with the given email
        const admin = await Admin.findOne({ email });
        console.log(email, password);
        // check if the admin exists
        if (!admin) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        console.log(email, password);
        // compare the entered password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, admin.password);
        // check if the password matches
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Create a JWT token
        const token = jwt.sign({ Admin: admin }, process.env.JWT_SECRET, {
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

/** Create a New Job */

export async function createJob(req, res) {
    try {
        const {
            title,
            description,
            requirements,
            cgpaWeightage,
            universityWeightage,
            skillsWeightage,
            similarityScoreWeightage,
            highestEducationBonusWeightages,
            workExperienceWeightage,
            deadline,
            createdBy,
            seats
        } = req.body;

        const admin = await Admin.findOne({ email: createdBy.Admin.email });

        const job = new Job({
            title,
            description,
            requirements,
            cgpaWeightage,
            universityWeightage,
            skillsWeightage,
            similarityScoreWeightage,
            highestEducationBonusWeightages,
            workExperienceWeightage,
            deadline,
            createdBy: admin._id,
            seats
        });

        const newJob = await job.save();

        res.status(201).json({
            message: 'Job created successfully',
            job: newJob,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
}

/** Delete a job */
export async function deleteJob(req, res) {
    try {
        const jobId = req.params.id;
        console.log(jobId)
        const deletedJob = await Job.findByIdAndDelete(jobId);
        if (!deletedJob) {
            return res.status(404).json({ message: "Job not found" });
        }
        return res.status(200).json({ message: "Job deleted successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

/** Fetch all the appplicant for a job */
export async function getJobApplicants(req, res) {
    try {
        const jobId = req.params.id;
        const jobApplications = await JobApplication.find({ job: jobId }).populate('candidate');
        if (jobApplications.length === 0) {
            return res.status(404).json({ message: "No applications found for this job" });
        }

        return res.status(200).json(jobApplications);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
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



export async function shortlistForJob(req, res) {
    try {
        const { jobName } = req.body;
        console.log('Shortlisted job:', jobName);

        // Find the job based on the job name
        const job = await Job.findOne({ title: jobName });
        if (!job) {
            throw new Error('Job not found');
        }

        // Get the number of candidates that applied to the job
        const candidateCount = await JobApplication.countDocuments({ job: job._id });

        console.log('Number of candidates applied:', candidateCount);

        // Get the number of required seats from the job
        let requiredSeats = job.seats * 4;
        if (requiredSeats > candidateCount) {
            requiredSeats = candidateCount;
        }
        console.log('Required seats:', requiredSeats);

        // Retrieve the top n job applications with the highest score
        const topJobApplications = await JobApplication.find({ job: job._id })
            .sort({ score: -1 })
            .limit(requiredSeats);

        console.log('Top Job Applications:');
        topJobApplications.forEach((application, index) => {
            console.log(`Application ${index + 1}:`, application);
        });

        // Update the status of the top job applications to 'shortlisted'
        const applicationIds = topJobApplications.map((application) => application._id);
        await JobApplication.updateMany(

            { _id: { $in: applicationIds } },
            { $set: { status: 'Stage-1' } }
        );

        console.log('Status updated to "shortlisted" for top job applications.');
        const rejectedApplications = await JobApplication.find({
            job: job._id,
            status: { $ne: 'Stage-1' } // Find applications that are not shortlisted
        });

        const rejectedApplicationIds = rejectedApplications.map((application) => application._id);
        await JobApplication.updateMany(
            { _id: { $in: rejectedApplicationIds } },
            { $set: { status: 'Rejected' } }
        );

        // Perform other logic related to shortlisting the job
        // Process each shortlisted job application
        for (const application of topJobApplications) {
            // Create a test object with 10 random questions
            const questions = await Question.aggregate([
                { $sample: { size: 20 } } // Get 10 random questions from the question pool
            ]);

            const deadline = job.testDeadline;

            // Adjust the deadline to match Pakistan time
            deadline.setUTCHours(deadline.getUTCHours() + 5); // Add 5 hours for Pakistan's time zone offset (UTC+5)

            const test = new Test({ questions, deadline });
            await test.save();

            // Update the test and score fields in the job application
            await JobApplication.updateOne(
                { _id: application._id }, // Update the job application based on its ID
                { $set: { test: test._id, test_score: -1 } } // Set the test and test_score fields
            );

            console.log(`Test object created and associated with job application: ${application._id}`);
            console.log(application);

            // Find the job title from the application's job object
            const job = await Job.findById(application.job);
            const jobTitle = job.title;

            // Find the candidate email from the application's candidate object
            const candidate = await Candidate.findById(application.candidate);
            const candidateEmail = candidate.email;
            const testLink = `localhost:3000/test/${test._id}/${candidate._id}`;
            // Send email to the user
            const transporter = nodemailer.createTransport({
                // Configure your email provider details here
                service: 'gmail',
                auth: {
                    user: 'applicationstatus01@gmail.com',
                    pass: 'svljqlfxzccyrudg'
                }
            });

            const deadlineFormatted = deadline.toLocaleString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                timeZone: 'Asia/Karachi' // Adjust the time zone accordingly
            });

            const mailOptions = {
                from: 'applicationstatus01@gmail.com',
                to: candidateEmail,
                subject: 'Test Invitation',
                html: `<p>Dear ${candidate.name},</p>
              
                <p>We hope this email finds you well.</p>
                
                <p>We would like to invite you to take the test for the ${jobTitle} position. This test is an important part of our evaluation process, and we appreciate your participation.</p>
              
                <p>To take the test, please click on the following link:</p>
                <p><a href="${testLink}">${testLink}</a></p>
              
                <p>Please note the following instructions:</p>
              
                <ol>
                  <li>Test Duration: You will have a specific time limit to complete the test. Make sure you have a stable internet connection and a quiet environment to focus on the test.</li>
                  <li>Test Content: The test will consist of ${questions.length} questions related to the General concept of programming. Answer each question to the best of your abilities.</li>
                  <li>
                    <strong>Test Deadline: The test must be completed before the ${deadlineFormatted}.</strong>
                  </li>
                  <li>Test Access: Please ensure that you are using the latest version of a compatible web browser to access the test link. We recommend using Google Chrome for the best experience.</li>
                </ol>
              
                <p>If you encounter any technical issues or have any questions related to the test, please reach out to our support team at [Support Contact Email/Phone Number].</p>
              
                <p>We appreciate your dedication and effort in taking this test. Good luck, and we look forward to reviewing your results.</p>
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
        }


        // Send a response if needed
        res.status(200).json({ message: 'Job shortlisted successfully' });
    } catch (error) {
        console.error('Error shortlisting job:', error);
        res.status(500).json({ error: 'Internal server error' });
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

export async function finalShortlistingForJob(req, res) {
    try {
        const { jobName } = req.body;
        console.log('Shortlisted job:', jobName);

        // Find the job based on the job name
        const job = await Job.findOne({ title: jobName });
        if (!job) {
            throw new Error('Job not found');
        }

        // Get the number of candidates that applied to the job
        const candidateCount = await JobApplication.countDocuments({ job: job._id });

        console.log('Number of candidates applied:', candidateCount);

        // Get the number of required seats from the job
        let requiredSeats = job.seats;
        if (requiredSeats > candidateCount) {
            requiredSeats = candidateCount;
        }
        console.log('Required seats:', requiredSeats);

        // Retrieve the top n job applications with the highest score
        const topJobApplications = await JobApplication.find({ job: job._id })
            .sort({ test_score: -1 })
            .limit(requiredSeats);

        console.log('Top Job Applications:');
        topJobApplications.forEach((application, index) => {
            console.log(`Application ${index + 1}:`, application);
        });

        // Update the status of the top job applications to 'shortlisted'
        const applicationIds = topJobApplications.map((application) => application._id);
        await JobApplication.updateMany(
            { _id: { $in: applicationIds } },
            { $set: { status: 'shortlisted' } }
        );

        console.log('Status updated to "shortlisted" for top job applications.');

        // Update the status of the remaining applications to 'rejected'
        const rejectedApplications = await JobApplication.find({
            job: job._id,
            status: { $ne: 'shortlisted' } // Find applications that are not shortlisted
        });

        const rejectedApplicationIds = rejectedApplications.map((application) => application._id);
        await JobApplication.updateMany(
            { _id: { $in: rejectedApplicationIds } },
            { $set: { status: 'rejected' } }
        );

        console.log('Status updated to "rejected" for remaining job applications.');

        // Perform other logic related to shortlisting the job

        // Send a response if needed
        res.status(200).json({ message: 'Job shortlisted successfully' });
    } catch (error) {
        console.error('Error shortlisting job:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Assuming you have the necessary imports and setup for Express, Mongoose, and bcrypt

export async function addAdmin(req, res) {
    try {
        const { name, email, password } = req.body;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new instance of the admin model
        const newAdmin = new Admin({
            name,
            email,
            password: hashedPassword, // Store the hashed password
        });

        // Save the new admin to the database
        const savedAdmin = await newAdmin.save();

        res.status(201).json(savedAdmin);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add admin' });
    }
}

// Assuming you have the necessary imports and setup for Express and Mongoose

export async function addMCQ(req, res) {
    try {
        const { question, options, correctAnswer, subject } = req.body;

        // Create a new instance of the mcq model
        const newMCQ = new Question({
            question,
            options,
            correctAnswer,
            subject,
        });

        // Save the new MCQ to the database
        const savedMCQ = await newMCQ.save();

        res.status(201).json(savedMCQ);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add MCQ' });
    }
}


