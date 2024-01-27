import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const SidebarWrapper = styled.div`
  background-color: #f0f0f0;
  width: 200px;
  padding: 20px;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
`;

const Title = styled.h2`
  margin-bottom: 20px;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ListItem = styled.li`
  margin-bottom: 10px;
`;

const Button = styled.button`
  display: block;
  width: 100%;
  padding: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }

  &:focus {
    outline: none;
  }
`;

const ContentWrapper = styled.div`
  margin-left: 200px; /* Same width as the Sidebar */
  padding: 20px;
`;

const Sidebar = () => {
  const navigate = useNavigate();
  const handleClickCreateJob = () => {
    const jobParams = {
      title: 'Job Title',
      description: 'Job Description',
      requirements: 'Job Requirements',
      cgpaWeightage: 10,
      universityWeightage: 10,
      skillsWeightage: 30,
      similarityScoreWeightage: 35,
      highestEducationBonusWeightages: 5,
      workExperienceWeightage: 10,
      deadline: '2023-06-30',
    };

    navigate('/createJob', { state: jobParams });
  };

  const handleClickViewApplications = () => {
    navigate('/shortlist');
  };
  const handleClickHome = () => {
    navigate('/adminDashboard');
  };

  const handleClickFinalShortlisting = () => {
    navigate('/finalShortlisting');
  };

  const handleClickNewAdmin = () => {
    navigate('/addAdmin');
  };

  const handleClickLogout = () => {
    navigate('/adminSignin');
  };

  const handleClickAddMCQS = () => {
    navigate('/addMCQs');
  };

  return (
    <>
      <SidebarWrapper>
        <Title>Admin Dashboard</Title>
        <List>
          <ListItem>
            <Button onClick={handleClickHome}>Home</Button>
          </ListItem>
          <ListItem>
            <Button onClick={handleClickCreateJob}>Create Job</Button>
          </ListItem>

          <ListItem>
            <Button onClick={handleClickViewApplications}>View Applications</Button>
          </ListItem>
          <ListItem>
            <Button onClick={handleClickFinalShortlisting}>Send Job Offers</Button>
          </ListItem>
          <ListItem>
            <Button onClick={handleClickNewAdmin}>Create New Admin</Button>
          </ListItem>
          <ListItem>
            <Button onClick={handleClickAddMCQS}>Add MCQs</Button>
          </ListItem>
          <ListItem>
            <Button onClick={handleClickLogout}>Logout</Button>
          </ListItem>
        </List>
      </SidebarWrapper>
      <ContentWrapper>
        {/* Add your content here */}
      </ContentWrapper>
    </>
  );
};

export default Sidebar;
