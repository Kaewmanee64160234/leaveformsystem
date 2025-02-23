// src/components/LeaveForm.jsx
import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LeaveForm = () => {
  const [leaveType, setLeaveType]   = useState('');
  const [startDate, setStartDate]   = useState('');
  const [endDate, setEndDate]       = useState('');
  const [reason, setReason]         = useState('');
  const navigate                  = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Send the leave request data to your backend API.
    navigate('/leave-history');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <form 
        onSubmit={handleSubmit} 
        className="bg-white p-6 rounded shadow-md w-full max-w-lg"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Apply for Leave</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Leave Type</label>
          <select 
            value={leaveType} 
            onChange={(e) => setLeaveType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          >
            <option value="">Select a leave type</option>
            <option value="sick">Sick Leave</option>
            <option value="vacation">Vacation</option>
            <option value="personal">Personal Leave</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Start Date</label>
          <input 
            type="date" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required 
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">End Date</label>
          <input 
            type="date" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required 
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Reason</label>
          <textarea 
            value={reason} 
            onChange={(e) => setReason(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            rows="4"
            required
          ></textarea>
        </div>
        <button 
          type="submit" 
          className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
        >
          Submit Leave Request
        </button>
      </form>
    </div>
  );
};

export default LeaveForm;
