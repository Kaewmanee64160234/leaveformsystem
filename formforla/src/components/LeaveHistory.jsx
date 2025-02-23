// src/components/LeaveHistory.jsx
import  { useState, useEffect } from 'react';

const LeaveHistory = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);

  useEffect(() => {
    // TODO: Replace with an API call to fetch leave history data.
    // For demonstration, we use dummy data.
    const dummyData = [
      {
        id: 1,
        leaveType: 'Vacation',
        startDate: '2023-05-01',
        endDate: '2023-05-05',
        reason: 'Family trip',
        status: 'approved'
      },
      {
        id: 2,
        leaveType: 'Sick Leave',
        startDate: '2023-06-10',
        endDate: '2023-06-12',
        reason: 'Medical reasons',
        status: 'pending'
      }
    ];
    setLeaveRequests(dummyData);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="mb-4">
        <h1 className="text-2xl font-bold">Leave History</h1>
      </header>
      <div className="bg-white shadow rounded p-4 overflow-x-auto">
        {leaveRequests.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Leave Type</th>
                <th className="px-4 py-2 text-left">Start Date</th>
                <th className="px-4 py-2 text-left">End Date</th>
                <th className="px-4 py-2 text-left">Reason</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {leaveRequests.map((request) => (
                <tr key={request.id}>
                  <td className="px-4 py-2">{request.id}</td>
                  <td className="px-4 py-2">{request.leaveType}</td>
                  <td className="px-4 py-2">{request.startDate}</td>
                  <td className="px-4 py-2">{request.endDate}</td>
                  <td className="px-4 py-2">{request.reason}</td>
                  <td className="px-4 py-2">{request.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No leave requests found.</p>
        )}
      </div>
    </div>
  );
};

export default LeaveHistory;
