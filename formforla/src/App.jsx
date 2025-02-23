// src/App.jsx
import 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './views/Login';
import Register from './views/Register';
import EmployeeHome from './views/EmployeeHome';
import LeaderHome from './views/LeaderHome';
import LeaveForm from './views/LeaveForm';
import LeaveHistory from './views/LeaveHistory';
import CreateLeaveType from './views/CreateLeaveType';
import LeaveRequests from './views/LeaveRequests';
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
        <Route path="/create-leave-type" element={<CreateLeaveType />} />
        <Route path="/leave-requests" element={<LeaveRequests />} />
      </Routes>
    </Router>
  );
}

export default App;
