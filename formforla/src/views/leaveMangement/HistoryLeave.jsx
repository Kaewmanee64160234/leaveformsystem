import { useState, useEffect } from "react";
import NavBar from "../../components/NavBar";
import Swal from "sweetalert2";

const HistoryLeave = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  // eslint-disable-next-line no-empty-pattern
  // const [] = useState(true);

  // Get user ID from local storage
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
  const user_id = user ? user.id : null;

  useEffect(() => {
    if (user_id) {
      fetchLeaveHistory();
    }
  }, [user_id]);

  const fetchLeaveHistory = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : null;
  
      if (!user) {
        Swal.fire({ icon: "error", title: "Error", text: "Please log in first." });
        return;
      }
  
      const response = await fetch(`http://localhost:5000/api/leave-requests/user/${user.id}`);
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log(data);
      
      setLeaveRequests(data);
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Error", text: "An error occurred while fetching leave history." });
    }
  };
  

  const formatDate = (dateStr) => {
    return dateStr ? new Date(dateStr).toLocaleDateString() : "-";
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <div className="p-4">
        <header className="mb-4">
          <h1 className="text-2xl font-bold">History Leave</h1>
        </header>
        <div className="bg-white shadow rounded p-4 overflow-x-auto">
          {console.log("Rendering Table Data:", leaveRequests)}  {/* Debugging */}
  
          {leaveRequests.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">Leave Type</th>
                  <th className="px-4 py-2 text-left">Start Date</th>
                  <th className="px-4 py-2 text-left">End Date</th>
                  <th className="px-4 py-2 text-left">Total Days</th>
                  <th className="px-4 py-2 text-left">Reason</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Approved By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {leaveRequests.map((request, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{request.leaveType}</td>
                    <td className="px-4 py-2">{formatDate(new Date(request.start_date).toLocaleDateString())}</td>
                    <td className="px-4 py-2">{formatDate(new Date(request.end_date).toLocaleDateString())}</td>
                    <td className="px-4 py-2">
                      {Math.ceil((new Date(request.end_date) - new Date(request.start_date)) / (1000 * 60 * 60 * 24)) + 1} days
                    </td>
                    <td className="px-4 py-2">{request.reason}</td>
                    <td className="px-4 py-2">{request.status}</td>
                    <td className="px-4 py-2">{request.approved_by || "Pending"}</td>
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
