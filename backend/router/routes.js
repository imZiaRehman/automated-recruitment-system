import { Router } from "express";
import jwt from 'jsonwebtoken';
const router = Router();

import * as controller from '../controller/controller.js';
import * as testWebController from '../controller/TestWebsiteController.js';
import * as adminController from '../controller/AdminController.js';

// Middleware to verify JWT token
function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    console.log(token);
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded) {
        console.log("unathorized");
        return res.status(401).json({ message: 'Unauthorized' });
      }
      console.log(decoded);
      req.user = decoded.user; // Attach user object to request object
      next();
    } catch (err) {
        console.log("unathorized");
      return res.status(401).json({ message: 'Unauthorized' });
    }
  }
  
  
/** Test Website Backend routes */
router.route('/getQuestions/:testID').get(testWebController.getQuestions)
router.route('/verifyCandidate').post(testWebController.verifyTestCandidate);
router.route('/verifyToken').post(testWebController.verifyTestWebsiteToken);
router.route('/submitQuestion').post(testWebController.submitQuestion);
router.route('/submitTest').post(testWebController.submitTest);
router.route('/incrementCount').post(testWebController.incrementTabSwitchCount);


/** Admin Backend Routes */

/** Admin Backend Routes */
router.route('/Admin/SignUp').post(adminController.SignUpAdmin)
router.route('/Admin/SignIn').post(adminController.signInAdmin)
router.route('/Admin/createJob').post(adminController.createJob)
router.delete('/Admin/deleteJob/:id', adminController.deleteJob)
router.route('/Admin/job/allApplicants').get(adminController.getAllJobApplications)
router.route('/Admin/job/:id/applicants').get(adminController.getJobApplicants);
router.route('/Admin/shortlist').post(adminController.shortlistForJob)
router.route('/Admin/finalShortlisting').post(adminController.finalShortlistingForJob)


/** Candiate Backend Routes for  */
router.route('/Candidate/SignUp').post(controller.signUpCandidateForJobWebsite)
router.route('/Candidate/SignIn').post(controller.signInCandidateForJobWebsite)
router.route('/jobs/:jobId/apply').post(controller.applyToJob);
//get username and email of the signed in candidate after verifying it token
router.route('/Candidate/profile').get(verifyToken, controller.getProfile);
router.route('/ActiveJobs/:id').get(controller.getoneJobs);
router.route('/Candidate/job/applications').get(controller.getJobApplicationStatus);
router.route('/Candidate/:jodId/UpdateInformation').post(controller.updateFeatures);
router.route('/Candidate/Changepassword').post(controller.updatePassword);
router.route('/Candidate/ForgotPassword').post(controller.ForgotPassword);
router.route('/Candidate/VerifyOTP').post(controller.verifyOTP);
router.route('/Candidate/reset-password').post(controller.resetPassword);

/** Routes Applicable to both Admin and Candidates */
router.route('/ActiveJobs').get(controller.getActiveJobs)


export default router;
