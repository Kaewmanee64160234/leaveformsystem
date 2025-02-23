import { useState, useEffect } from "react";
import NavBar from "../../components/NavBar";

const HistoryLeave = () => {
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

  // Helper function to format date strings
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString(); // You can customize locale and options if needed
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <div className="p-4">
        <header className="mb-4">
          <h1 className="text-2xl font-bold">History Leave</h1>
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
                {leaveRequests.map((request, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2">{ index+1}</td>
                    <td className="px-4 py-2">{request.leaveType}</td>
                    <td className="px-4 py-2">
                      {formatDate(request.startDate)}
                    </td>
                    <td className="px-4 py-2">{formatDate(request.endDate)}</td>
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

export default HistoryLeave;
