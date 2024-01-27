import { Job, Admin, Candidate, Question, Test, JobApplication } from "../models/model.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import multer from 'multer';
import fs from 'fs';
import nodemailer from 'nodemailer';

/** Controller to verify a user by test id and user id and generate a token */
export async function verifyTestCandidate(req, res) {
    try {
        const { testId, candidateId } = req.body;
        // Simulate a delay of 2 to 3 seconds
        await new Promise((resolve) => {
            setTimeout(resolve, Math.random() * 1000 + 2000); // Delay between 2000ms (2s) and 3000ms (3s)
        });
        console.log(testId, candidateId);
        // Check if a job application exists with the provided test ID and candidate ID
        const jobApplication = await JobApplication.findOne({
            test: testId,
            candidate: candidateId,
        });

        if (!jobApplication) {
            console.log("Job application not found");
            return res.status(404).json({ error: "Job application not found" });
        }
        if(jobApplication.test_score > -1){
            console.log("Test Alredy Taken");
            return res.status(404).json({ error: "Test already taken" });
        }

        // Get the test object based on the test ID
        const test = await Test.findById(testId);

        // Check if the deadline has been reached
        // if (test.deadline < Date.now()) {
        //     console.log("Deadline reached");
        //     return res.status(404).json({ error: "Deadline reached" });
        // }

        // Generate a token for future requests
        const token = jwt.sign({ testId, candidateId }, "your_secret_key");

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export function verifyTestWebsiteToken(req, res) {
    const { token } = req.body;
    console.log(token);
    try {
      // Verify and decode the token using the secret key
      const decoded = jwt.verify(token, "your_secret_key");
      // Return the decoded token payload
      if (decoded) {
        res.status(200).json({ message: 'Authorized' });
      } else {
        res.status(400).json({ message: 'UnAuthorized' });
      }
    } catch (error) {
      // If the token verification fails, throw an error or handle it as desired
      res.status(401).json({ message: 'Unauthorized' });
    }
  }
  


/** Sign in Candidate to the system */
export async function signInCandidate(req, res) {
    try {
        const { email, password } = req.body;

        // find the user with the given email
        const user = await Candidate.findOne({ email });

        // check if the user exists
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // compare the entered password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);

        // check if the password matches
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Check if the user has any test to do
        const jobApplication = await JobApplication.findOne({ candidate: user._id });
        console.log(jobApplication);
        // Check if the user has a test associated with the job application
        if (!jobApplication || !jobApplication.test) {
            return res.status(400).json({ message: 'No test found for the user' });
        }

        // Check if the test's deadline has passed
        const test = await Test.findById(jobApplication.test);
        const currentDate = new Date();

        if (currentDate > test.deadline) {
            return res.status(400).json({ message: 'Test deadline has passed' });
        }

        // Create a JWT token
        const token = jwt.sign({ user }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.json({
            message: 'Login Successfully.',
            token: token,
            status: true,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

/** Get Questions */

export async function getQuestions(req, res) {
    try {
        const testID = req.params.testID;

        console.log(testID)
        // Find the test based on the test ID
        const test = await Test.findById(testID).populate("questions");

        if (!test) {
            console.log("test not found");
            return res.status(404).json({ message: "Test not found" });
        }

        // Retrieve the questions associated with the test
        const questions = test.questions;

        res.json({ questions });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export async function submitTest(req, res) {
    let { test_id, candidate_id } = req.body;
    console.log(req.body);
    try {
        const application = await JobApplication.findOneAndUpdate(
            { candidate: candidate_id, test: test_id },
            { $inc: { test_score: 1 } },
            { new: true }
        );
        return res.status(200).json(application);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export async function submitQuestion(req, res) {
    let { test_id, candidate_id, question_title, answer } = req.body;
    console.log(req.body);
    try {
        // Find the test based on the test_id
        const test = await Test.findById(test_id).populate('questions');
        if (!test) {
            return res.status(404).json({ error: 'Test not found' });
        }

        // Find the question based on the question_title
        const question = await Question.findOne({ question: question_title });
        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }
        answer += 1;
        // Compare the user's answer with the correct answer
        const isCorrect = question.correctAnswer === answer;
        if (isCorrect) {
            console.log("Your answer is correct");
        } else {
            console.log("Wrong answer");
            console.log("Correct answer was", question.correctAnswer);
        }
        // Update the application with the score and test_score
        const application = await JobApplication.findOneAndUpdate(
            { candidate: candidate_id, test: test_id },
            { $inc: { test_score: isCorrect ? 1 : 0 } },
            { new: true }
        );

        return res.status(200).json(application);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export async function incrementTabSwitchCount(req, res) {
    let { test_id, candidate_id } = req.body;
    console.log(req.body);
    try {
    
        // Find the question based on the question_title
   
        // Update the application with the score and test_score
        const application = await JobApplication.findOneAndUpdate(
            { candidate: candidate_id, test: test_id },
            { $inc: { tabSwitch: 1 } },
            { new: true }
        );
        return res.status(200).json(application);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}


//Link with inserting question Not required anymore
const mcqs = [
    {
        question: 'What is the output of the following code snippet?\n#include <stdio.h>\nint main() {\nint x = 5, y = 7:\nprintf("%d\n", x + y):\nreturn 0:}',
        options: ['5', '7', '12', '35'],
        correctAnswer: 3,
        subject: 'Programming-Fundamentals'
    },
    {
        question: 'Which of the following is not a valid variable name in C/C++?',
        options: ['myVariable', 'MyVariable', 'My_variable', '1Variable'],
        correctAnswer: 4,
        subject: 'Programming-Fundamentals'
    },
    {
        question: 'What is the output of the following code snippet?\n#include <stdio.h>\nint main() {\nint i = 0:\nwhile (i < 5) {\nprintf("%d ", i)\ni++:  }\nreturn 0:}',
        options: ['0 1 2 3 4', '1 2 3 4 5', '5 4 3 2 1', '4 3 2 1 0'],
        correctAnswer: 1,
        subject: 'Programming-Fundamentals'
    },
    {
        question: 'What does the sizeof operator return in C/C++?',
        options: ['The value of a variable', 'The address of a variable', 'The size of a variable in bytes', 'The data type of a variable'],
        correctAnswer: 3,
        subject: 'Programming-Fundamentals'
    },
    {
        question: 'What is the output of the following code snippet?\n#include <stdio.h>\nint main() { \nint x = 10:\nif (x > 5) {\nprintf ("x is greater than 5\\n”): \n}\nelse { \nprintf("x is less than or equal to 5"):}\nreturn 0:\n}',
        options: ['x is greater than 5', 'x is less than or equal to 5', '10', 'None of the above'],
        correctAnswer: 1,
        subject: 'Programming-Fundamentals'
    },
    {
        question: 'Which of the following is not a valid data type in C/C++?',
        options: ['float', 'char', 'string', 'double'],
        correctAnswer: 3,
        subject: 'Programming-Fundamentals'
    },
    {
        question: 'Which of the following is the correct syntax to declare a function in C/C++?',
        options: ['function myFunction() {}', 'return myFunction() {}', 'int myFunction() {}', 'myFunction() {}'],
        correctAnswer: 3,
        subject: 'Programming-Fundamentals'
    },
    {
        question: 'Identify the correct extension of the user-defined header file in C++.',
        options: ['.cpp', '.hg', '.h', '.hf'],
        correctAnswer: 3,
        subject: 'Programming-Fundamentals'
    },
    {
        question: 'Which of the following is the address of the operator ?',
        options: ['&', '*', '&&', '[]'],
        correctAnswer: 1,
        subject: 'Programming-Fundamentals'
    },
    {
        question: 'goto can be classified into?',
        options: ['Label', 'Variable', 'Operator', 'Function'],
        correctAnswer: 1,
        subject: 'Programming-Fundamentals'
    }, {
        question: 'By which of the following can the if-else statement be replaced?',
        options: ['Bitwise operator', 'Logical operator', 'Conditional operator', 'Arithmetic operator'],
        correctAnswer: 3,
        subject: 'Programming-Fundamentals'
    },

    {
        question: 'Choose the correct default return value of function',
        options: ['Int', 'Void', 'Char', 'Float'],
        correctAnswer: 1,
        subject: 'Programming-Fundamentals'
    },

    {
        question: ' When can an inline function be expanded ',
        options: ['Runtime', 'Compile Time', 'Never gets expanded', 'All of the above'],
        correctAnswer: 2,
        subject: 'Programming-Fundamentals'
    },

    {
        question: 'Choose the correct option which is mandatory in a function',
        options: ['return_typel', 'parameters', 'function_name', 'both a and c'],
        correctAnswer: 4,
        subject: 'Programming-Fundamentals'
    },
    {
        question: 'The constants in C++ are also known as?',
        options: ['pre-processors', 'literals', 'const', 'none'],
        correctAnswer: 2,
        subject: 'Programming-Fundamentals'
    },
    {
        question: ' Using which of the following keywords can an exception be generated?',
        options: ['threw', 'throws', 'throw', 'catch'],
        correctAnswer: 3,
        subject: 'Programming-Fundamentals'
    },
    {
        question: 'Identify the size of int datatype in C++.',
        options: ['1 byte', '2 byte', '3 byte', 'depends on compiler'],
        correctAnswer: 4,
        subject: 'Programming-Fundamentals'
    },
    {
        question: 'Which of the following types is the language C++?',
        options: ['Procedural', 'Statically typed language', 'dynamically typed language', 'all of the above'],
        correctAnswer: 2,
        subject: 'Programming-Fundamentals'
    },
    {
        question: 'Identify the format string among the following',
        options: ['&', '/n', '%d', 'none'],
        correctAnswer: 3,
        subject: 'Programming-Fundamentals'
    },
    {
        question: ' What is do-while loop also known as',
        options: ['exit control', 'entry control', 'per tested', 'all of the above'],
        correctAnswer: 1,
        subject: 'Programming-Fundamentals'
    },
    {
        question: 'Identify the correct range of signed char.',
        options: ['-256 to 255', '-128 to 127 ', '0 to 255', '0 to 127'],
        correctAnswer: 2,
        subject: 'Programming-Fundamentals'
    },
    {
        question: 'Identify the logical AND operator',
        options: ['&&', '||', '&', 'AND'],
        correctAnswer: 1,
        subject: 'Programming-Fundamentals'
    },
    {
        question: ' Choose the correct subscript operator.',
        options: ['[ ]', '{ }', '( )', '*'],
        correctAnswer: 1,
        subject: 'Programming-Fundamentals'
    },
    {
        question: ' Choose the type of loop which is guaranteed to execute at-least once.',
        options: ['for loop', 'while', 'do-while', 'None'],
        correctAnswer: 3,
        subject: 'Programming-Fundamentals'
    },
    {
        question: ' Using which of the following data types can 19.54 be represented?.',
        options: ['void', 'double', 'int', 'none'],
        correctAnswer: 2,
        subject: 'Programming-Fundamentals'
    },
    {
        question: ' Which of the following data type is supported in C++ but not in C?.',
        options: ['int', 'bool', 'double', 'float'],
        correctAnswer: 2,
        subject: 'Programming-Fundamentals'
    },
    {
        question: ' C++ uses which approach.',
        options: ['right-left', 'left-right', 'top-down', 'bottom-up'],
        correctAnswer: 4,
        subject: 'Programming-Fundamentals'
    },
    {
        question: ' Identify the correct example for a pre-increment operator.',
        options: ['++n', 'n++', 'n+', '+n'],
        correctAnswer: 1,
        subject: 'Programming-Fundamentals'
    }
];


/** insert all questinos */
export async function insertQuestions(req, res) {
    try {
        Question.insertMany(mcqs)
            .then(() => console.log('Inserted MCQs data'))
            .catch(err => console.log('Error inserting MCQ data:', err))
        res.json({ result: "Insertion Done" })
    } catch (error) {
        res.json({ error })
    }
}

