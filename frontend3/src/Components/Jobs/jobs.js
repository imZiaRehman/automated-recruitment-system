import React, { useEffect, useState } from 'react';
import { Card, Button, Container, Row, Col, Spinner } from 'react-bootstrap';
import axios from 'axios';
import './jobs.css';

const JobListPage = () => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch available jobs from the backend
    const fetchJobs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/ActiveJobs');
        setJobs(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchJobs();
  }, []);

  return (
    <Container className='container'> 
      <h1 className="text-center">Available Jobs</h1>

      {isLoading ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <Row>
          {jobs.map((job) => (
            <Col key={job.id} md={4} sm={6} xs={12}>
              <Card className="neumorphism-card mb-4">
                <Card.Body>
                  <Card.Title className="card-title">{job.title}</Card.Title>
                  <Card.Text>{job.description.substring(0, 100)}...</Card.Text>
                  <Button variant="primary" href={`/jobs/${job._id}`}>
                    Read More
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default JobListPage;
