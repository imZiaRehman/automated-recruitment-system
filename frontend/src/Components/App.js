import '../Styles/App.css';
import Login from './Login';
import Instructions from './Instructions';
import Test from './TestPage/test';
import HomePage from './homepage';
import TestProcessing from './TestPage/testProcessing';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InvalidLinkPage from './invalidLink';
import FinishPage from './Finish';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/instructions" element={<Instructions />} />
          <Route path="/invalid-link" element={<InvalidLinkPage/>}/>
          <Route path="/test/:testId/:candidateId" element={<TestProcessing />} />
          <Route path="/test" element= {<Test />} />
          <Route path="/finish" element={<FinishPage/>}/>

        </Routes>
      </Router>
    </>
  );
}

export default App;
