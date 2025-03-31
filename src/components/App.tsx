// import AIRecommendations from './AIRecommendations/AIRecommendations';
// import SignupForm from './Signup/SignupForm';
// import LoginForm from './Login/LoginForm';
import Home from './Home/Home';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';


const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* <Route path="/signup" element={<SignupForm />} />
          <Route path="/ai-recommendations" element={<AIRecommendations />} />
          <Route path="/login" element={<LoginForm />} /> */}
          <Route path="/home" element={<Home />} /> */
          <Route path="/" element={<Navigate to="/home" />} 
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;