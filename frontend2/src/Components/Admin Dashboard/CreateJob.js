import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './SideNavBar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './CreateJob.css'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios';
import jwt_decode from "jwt-decode";

const CreateJobPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const jobParams = location.state;

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [requirements, setRequirements] = useState('');
    const [cgpaWeightage, setCgpaWeightage] = useState(jobParams.cgpaWeightage || '');
    const [universityWeightage, setUniversityWeightage] = useState(jobParams.universityWeightage || '');
    const [skillsWeightage, setSkillsWeightage] = useState(jobParams.skillsWeightage || '');
    const [similarityScoreWeightage, setSimilarityScoreWeightage] = useState(
        jobParams.similarityScoreWeightage || ''
    );
    const [highestEducationBonusWeightages, setHighestEducationBonusWeightages] = useState(
        jobParams.highestEducationBonusWeightages || ''
    );
    const token = localStorage.getItem('token');
    const createdBy = jwt_decode(token);
    const [workExperienceWeightage, setWorkExperienceWeightage] = useState(jobParams.workExperienceWeightage || '');
    const [deadline, setDeadline] = useState(jobParams.deadline || '');
    const [testDeadline, setTestDeadline] = useState(jobParams.testDeadline || '');
    const [seats, setSeats] = useState(''); // New state variable for seats
    const [error, setError] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();

        const totalWeightage =
            parseFloat(cgpaWeightage) +
            parseFloat(universityWeightage) +
            parseFloat(skillsWeightage) +
            parseFloat(similarityScoreWeightage) +
            parseFloat(highestEducationBonusWeightages) +
            parseFloat(workExperienceWeightage);

        if (totalWeightage !== 100) {
            setError('Sum of weightages must be equal to 100');
            toast.error(error, { position: toast.POSITION.TOP_CENTER });
            return;
        } else if (title === '') {
            setError('Please give a job title');
            toast.error(error, { position: toast.POSITION.TOP_CENTER });
            return;
        } else if (description === '') {
            setError('Please give a job description');
            toast.error(error, { position: toast.POSITION.TOP_CENTER });
            return;
        } else if (requirements === '') {
            setError('Please give job requirements');
            toast.error(error, { position: toast.POSITION.TOP_CENTER });
            return;
        } else if (seats === '') {
            setError('Please enter the number of seats');
            toast.error(error, { position: toast.POSITION.TOP_CENTER });
            return;
        } else {
            try {
                const response = axios.post('http://localhost:5000/api/Admin/createJob', {
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
                    testDeadline,
                    createdBy,
                    seats, // Include seats in the data being sent
                });
                console.log(response.data);
                navigate('/adminDashboard');
            } catch (error) {
                setError('Invalid Job');
                console.error(error);
            }
        }

        // ...
    };

    return (
        <div className="app-container">
            
            <div className="content-container">
                <Form onSubmit={handleSubmit}>
                    <h1>Create Job</h1>
                    <Form.Group controlId="formTitle">
                        <Form.Label>Title:</Form.Label>
                        <Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                            style={{ width: '400px' }} />
                    </Form.Group>
                    <Form.Group controlId="formDescription">
                        <Form.Label>Description:</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            style={{ width: '900px' }}
                        />
                    </Form.Group>
                    <Form.Group controlId="formRequirements">
                        <Form.Label>Requirements:</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={requirements}
                            onChange={(e) => setRequirements(e.target.value)}
                            style={{ width: '400px' }}
                        />
                    </Form.Group>
                    <Form.Group controlId="formCgpaWeightage">
                        <Form.Label>CGPA Weightage:</Form.Label>
                        <Form.Control
                            type="number"
                            value={cgpaWeightage}
                            onChange={(e) => setCgpaWeightage(e.target.value)}
                            style={{ width: '400px' }}
                        />
                    </Form.Group>
                    <Form.Group controlId="formUniversityWeightage">
                        <Form.Label>University Weightage:</Form.Label>
                        <Form.Control
                            type="number"
                            value={universityWeightage}
                            onChange={(e) => setUniversityWeightage(e.target.value)}
                            style={{ width: '400px' }}
                        />
                    </Form.Group>
                    <Form.Group controlId="formSkillsWeightage">
                        <Form.Label>Skills Weightage:</Form.Label>
                        <Form.Control
                            type="number"
                            value={skillsWeightage}
                            onChange={(e) => setSkillsWeightage(e.target.value)}
                            style={{ width: '400px' }}
                        />
                    </Form.Group>
                    <Form.Group controlId="formSimilarityScoreWeightage">
                        <Form.Label>Similarity Score Weightage:</Form.Label>
                        <Form.Control
                            type="number"
                            value={similarityScoreWeightage}
                            onChange={(e) => setSimilarityScoreWeightage(e.target.value)}
                            style={{ width: '400px' }}
                        />
                    </Form.Group>
                    <Form.Group controlId="formHighestEducationBonusWeightages">
                        <Form.Label>Highest Education Bonus Weightages:</Form.Label>
                        <Form.Control
                            type="number"
                            value={highestEducationBonusWeightages}
                            onChange={(e) => setHighestEducationBonusWeightages(e.target.value)}
                            style={{ width: '400px' }}
                        />
                    </Form.Group>
                    <Form.Group controlId="formWorkExperienceWeightage">
                        <Form.Label>Work Experience Weightage:</Form.Label>
                        <Form.Control
                            type="number"
                            value={workExperienceWeightage}
                            onChange={(e) => setWorkExperienceWeightage(e.target.value)}
                            style={{ width: '400px' }}
                        />
                    </Form.Group>
                    <Form.Group controlId="formDeadline">
                        <Form.Label>Deadline:</Form.Label>
                        <Form.Control type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)}
                            style={{ width: '400px' }} />
                    </Form.Group>
                    <Form.Group controlId="formTestDeadline">
                        <Form.Label>Test Validity:</Form.Label>
                        <Form.Control type="date" value={testDeadline} onChange={(e) => setTestDeadline(e.target.value)} 
                            style={{ width: '400px' }}/>
                    </Form.Group>
                    <Form.Group controlId="formSeats"> {/* New Form.Group for seats */}
                        <Form.Label>Number of Seats:</Form.Label>
                        <Form.Control
                            type="number"
                            value={seats}
                            onChange={(e) => setSeats(e.target.value)}
                            style={{ width: '400px' }}
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit" style={{ marginTop: '10px' }}>
                        Create Job
                    </Button>
                </Form>
            </div>
        </div>
    );
};

export default CreateJobPage;
