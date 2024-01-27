import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Spinner, Alert, Table } from 'react-bootstrap';
import './JobStatus.css';

function JobStatus() {
  const [isLoading, setIsLoading] = useState(true);
  const [jobApplications, setJobApplications] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch job applications
    const email = localStorage.getItem('email');
    axios
      .get('http://localhost:5000/api/Candidate/job/applications', { params: { email } })
      .then((response) => {
        const { jobApplicationStatus } = response.data;
        setJobApplications(jobApplicationStatus);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="page-container">
      <h2 className="page-heading">Your Application Status</h2>
      {isLoading ? (
        // Show loading spinner while fetching data
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : (
        <>
          {error ? (
            // Display error message if request fails
            <Alert variant="danger">{error}</Alert>
          ) : (
            <>
              {jobApplications.length === 0 ? (
                // Display message if no job applications found
                <p>You have not applied to any job applications yet.</p>
              ) : (
                // Display job applications in a table
                <div className="table-container">
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Job Name</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {jobApplications.map((application) => (
                        <tr key={application._id}>
                          <td>{application.jobName}</td>
                          <td>
                            {application.status === 'Pending' && (
                              <span className="status-instruction">Your application is submitted. Check back later for updates.</span>
                            )}
                            {application.status === 'shortlisted' && (
                              <span className="status-instruction">You are selected! Check your email for more updates.</span>
                            )}
                            {application.status === 'Stage-1' && (
                              <span className="status-instruction">An email has been sent to you for a test. Please attempt it.</span>
                            )}
                            {application.status === 'rejected' && (
                              <span className="status-instruction">Your application is closed.</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default JobStatus;
