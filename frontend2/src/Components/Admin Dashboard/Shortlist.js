import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CardWrapper = styled.div`
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 10px;
  overflow: hidden;
  max-width: 1200px; /* Added */
  margin: 0 auto; /* Added */
`;

const CardHeader = styled.div`
  background-color: #f0f0f0;
  padding: 10px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    background-color: #e0e0e0;
  }
`;

const CardContent = styled.div`
  background-color: #fff;
  padding: 10px;

  .candidate-details {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ccc;
    padding: 10px 0;
  }

  .candidate-details:last-child {
    border-bottom: none;
  }

  .candidate-name {
    font-weight: bold;
    color: #333;
  }

  .candidate-university {
    color: #666;
  }

  .candidate-info {
    display: flex;
    flex-direction: column;
  }

  .info-label {
    font-weight: bold;
    color: #333;
  }

  .info-value {
    color: #666;
  }
`;

const CardListWrapper = styled.div`
  h1 {
    margin-bottom: 20px;
    color: #333;
  }
`;

const Card = ({ title, candidates }) => {
    const [expanded, setExpanded] = useState(false);

    const toggleExpansion = () => {
        setExpanded(!expanded);
    };

    const handleShortlist = async (jobName) => {
        console.log('Shortlisted job:', jobName);
        try {
            const response = await axios.post('http://localhost:5000/api/Admin/shortlist', { jobName });
            console.log('Shortlist response:', response.data);
            toast.success('Applications shortlisted successfully');
        } catch (error) {
            console.error('Error shortlisting job:', error);
            toast.error('Failed to shortlist applications');
        }
    };

    return (
        <CardWrapper className={expanded ? 'expanded' : ''}>
            <CardHeader onClick={toggleExpansion}>
                <h2>{title}</h2>
                <span>{expanded ? '-' : '+'}</span>
            </CardHeader>
            {expanded && (
                <CardContent>
                    {candidates.map((candidate) => (
                        <div className="candidate-details" key={candidate.email}>
                            <div className="candidate-info">
                                <span className="candidate-name">{candidate.name}</span>
                                <span className="candidate-university">{candidate.university}</span>
                            </div>
                            <div className="candidate-info">
                                <div>
                                    <span className="info-label">CGPA:</span>
                                    <span className="info-value">{candidate.cgpa}</span>
                                </div>
                                <div>
                                    <span className="info-label">Score:</span>
                                    <span className="info-value">{candidate.score}</span>
                                </div>
                            </div>
                            <div className="candidate-info">
                                <div>
                                    <span className="info-label">Email:</span>
                                    <span className="info-value">{candidate.email}</span>
                                </div>
                                <div>
                                    <span className="info-label">Skills:</span>
                                    <span className="info-value">{candidate.skills.join(', ')}</span>
                                </div>
                                <div>
                                    <span className="info-label">Work Experience:</span>
                                    <span className="info-value">{candidate.workExperience} years</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    <button onClick={() => handleShortlist(title)}>Shortlist</button> {/* New button */}
                </CardContent>
            )}
        </CardWrapper>
    );
};

const CardList = ({ data }) => {
    const [filterUniversity, setFilterUniversity] = useState('');
    const [filterCGPA, setFilterCGPA] = useState('');

    const uniqueTitles = [...new Set(data.map((candidate) => candidate.title))];

    const filteredCandidates = data.filter((candidate) => {
        if (filterUniversity && candidate.university.toLowerCase() !== filterUniversity.toLowerCase()) {
            return false;
        }
        if (filterCGPA && candidate.cgpa !== filterCGPA) {
            return false;
        }
        return true;
    });

    return (
        <CardListWrapper>
            <h1>Job Applications</h1>
            {uniqueTitles.map((title) => (
                <Card key={title} title={title} candidates={filteredCandidates.filter((candidate) => candidate.title === title)} />
            ))}
        </CardListWrapper>
    );
};

const JobApplications = () => {
    const [jsonData, setJsonData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/api/Admin/job/allApplicants');
                setJsonData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return <CardList data={jsonData} />;
};

export default JobApplications;