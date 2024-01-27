import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Button } from 'react-bootstrap';
import ApplyModal from './ApplyModal';
import { toast } from 'react-toastify';
import './jobs.css';
import { useNavigate } from 'react-router-dom';

const JobDetailsPage = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();
  let formattedDeadline;

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/ActiveJobs/${jobId}`);
        setJob(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  const handleApply = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleFileUpload = (file) => {
    setSelectedFile(file);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      const email = localStorage.getItem('email');
      formData.append('pdf', selectedFile);
      formData.append('email', email);

      const response = await axios.post(
        `http://localhost:5000/api/jobs/${jobId}/apply`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.message === 'You already applied to this job') {
        toast.success(response.data.message, { position: toast.POSITION.TOP_RIGHT });
      }

      if (response.data.message === 'Job application created') {
        const applicationData = response.data.applicationData;
        setShowModal(false);
        // Call the display page here after passing the two required parameters
        navigateToEditInformationPage(applicationData, jobId);
      }

      console.log(response.data);
    } catch (error) {
      console.error(error);
      toast.error('Error Applying to Job. Try later', { position: toast.POSITION.TOP_RIGHT });
    }

    setShowModal(false);
  };

  const navigateToEditInformationPage = (applicationData, jobId) => {
    navigate('/information', { state: { data: applicationData, jobId } });
  };

  if (!job) {
    return <div>Loading...</div>;
  } else {
    const deadlineDate = new Date(job.deadline);
    formattedDeadline = deadlineDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  return (
    <Container className="job-details-container">
      <h1 className="text-center">{job.title}</h1>
      <p className="multi-line-text justify-center">{job.description}</p>

      <p className="multi-line-text justify-center">
        <strong>Requirements:</strong> {job.requirements}
      </p>
      <p>
        <strong>Deadline:</strong> {formattedDeadline}
      </p>
      <div className="text-center">
        <Button onClick={handleApply}>Apply Now</Button>
      </div>
      <ApplyModal isOpen={showModal} onClose={handleCloseModal} onSubmit={handleSubmit} onFileUpload={handleFileUpload} />
    </Container>
  );
};

export default JobDetailsPage;
