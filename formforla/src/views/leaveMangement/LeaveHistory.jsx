import { useState, useEffect } from "react";
import NavBar from "../../components/NavBar";

const LeaveHistory = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);

  useEffect(() => {
    const fetchLeaveHistory = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/leave-requests"
        );
        const data = await response.json();
        if (response.ok) {
          setLeaveRequests(data);
        } else {
          alert(data.error || "Failed to fetch leave history");
        }
      } catch (err) {
        console.error(err);
        alert("An error occurred while fetching leave history");
      }
    };

    fetchLeaveHistory();
  }, []);
  const calculateTotalDays = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Include both start and end dates
    return diffDays;
  };
  
  // format date
  const formatDate = (dateStr) => {
    return dateStr ? new Date(dateStr).toLocaleDateString() : "-";
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <div className="p-4">
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
                  <th className="px-4 py-2 text-left">Total Days</th> {/* ✅ NEW COLUMN */}
                  <th className="px-4 py-2 text-left">Reason</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {leaveRequests.map((request) => (
                  <tr key={request.id}>
                    <td className="px-4 py-2">{request.id}</td>
                    <td className="px-4 py-2">{request.leaveType}</td>
                    <td className="px-4 py-2">
                      {formatDate(request.startDate)}
                    </td>
                    <td className="px-4 py-2">{formatDate(request.endDate)}</td>
                    <td className="px-4 py-2">
                      {calculateTotalDays(request.startDate, request.endDate)} days
                    </td>
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
    </div>
  );
};

export default LeaveHistory;
