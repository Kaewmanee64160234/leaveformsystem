// src/App.jsx
import 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import EmployeeHome from './components/EmployeeHome';
import LeaderHome from './components/LeaderHome';
import LeaveForm from './components/LeaveForm';
import LeaveHistory from './components/LeaveHistory';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/employee-home" element={<EmployeeHome />} />
        <Route path="/leader-home" element={<LeaderHome />} />
        <Route path="/leave-form" element={<LeaveForm />} />
        <Route path="/leave-history" element={<LeaveHistory />} />
      </Routes>
    </Router>
  );
}

export default App;
