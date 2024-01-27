import '../Styles/App.css';
import Login from './Login';
import CreateJobPage from './Admin Dashboard/CreateJob';
import JobApplications from './Admin Dashboard/Shortlist';
import FinalShortlisting from './Admin Dashboard/finalShortlisting';
 
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Layout from './Admin Dashboard/Layout';
import HomePage from './Admin Dashboard/homepage';
import AddNewAdmin from './Admin Dashboard/AddNewAdmin';
import AddNewMCQ from './Admin Dashboard/AddMCQs';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/adminDashboard" element={ <Layout> <HomePage/> </Layout> } />
        <Route path="/createJob" element={<Layout> <CreateJobPage/></Layout>} />
        <Route path="/shortlist" element={<Layout><JobApplications/></Layout>} />
        <Route path="/finalShortlisting" element={<Layout><FinalShortlisting/></Layout>} />
        <Route path="/addAdmin" element={<Layout><AddNewAdmin /></Layout>} />
        <Route path="/addMCQs" element={<Layout><AddNewMCQ/></Layout>} />
        <Route path="*" element={<RedirectToHome />} />
      </Routes>
    </Router>
  );
}

function RedirectToHome() {
  const navigate = useNavigate();
  navigate('/adminDashboard');
  return null;
}

export default App;
