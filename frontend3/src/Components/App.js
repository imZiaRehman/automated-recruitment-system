import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Layout from './Layout/Layout';
import Login from './Login';
import Home from './home';
import ForgotPassword from './ForgetPassword';
import JobListPage from './Jobs/jobs';
import JobDetailsPage from './Jobs/JobDetailPage';
import JobStatus from './Jobs/JobStatus';
import EditInformationPage from './Jobs/informationPage';
import ApplicationSubmitted from './Jobs/successfullMessage';
import ChangePasswordPage from './ChangePassword';
import ResetPassword from './Password';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Layout><Home /></Layout>} />
        <Route path="/applytojob" element={<Layout><JobListPage /></Layout>} />
        <Route path="/jobs/:jobId" element={<Layout><JobDetailsPage /></Layout>} />
        <Route path="/applicationstatus" element={<Layout><JobStatus /></Layout>} />
        <Route path="/forget-password" element={<ForgotPassword />} />
        <Route path="/information" element={<Layout><EditInformationPage /> </Layout>} />
        <Route path="/success" element={<Layout><ApplicationSubmitted /> </Layout>} />
        <Route path="/change-password" element={<Layout><ChangePasswordPage /> </Layout>} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<RedirectToHome />} />
      </Routes>
    </Router>
  );
}

function RedirectToHome() {
  const navigate = useNavigate();
  navigate('/');
  return null;
}

export default App;
