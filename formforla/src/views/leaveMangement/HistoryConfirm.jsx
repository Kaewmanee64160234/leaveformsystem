import { useState, useEffect } from "react";
import NavBar from "../../components/NavBar";
import Swal from "sweetalert2";

const HistoryConfirm = () => {

  // Function to calculate total days between two dates
  const calculateTotalDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [setNewStatus] = useState(""); // Correctly define setNewStatus

  // Get logged-in user ID from localStorage
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  const user_id = user ? user.id : null;

  useEffect(() => {
    if (user_id) {
      fetchLeaveHistory();
    }
  }, [user_id]);

  const fetchLeaveHistory = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/leave-requests/history/${user_id}`
      );
      const data = await response.json();
      if (response.ok) {
        setLeaveRequests(data);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.error || "Failed to fetch leave history",
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while fetching leave history",
      });
    }
  };

  // Check if a leave request is within 24 hours
  const isWithin24Hours = (createdAt) => {
    const createdTime = new Date(createdAt);
    const currentTime = new Date();
    return (currentTime - createdTime) / (1000 * 60 * 60) <= 24; // Convert milliseconds to hours
  };

  // Open modal
  const handleEditClick = (request) => {
    setSelectedRequest(request);
    setNewStatus(request.status);
  };

  // Update leave request status
  const updateLeaveStatus = async (status) => {
    if (!selectedRequest) return;
  
    try {
      const response = await fetch(
        `http://localhost:5000/api/leave-requests/${selectedRequest.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }), // Pass the status directly
        }
      );
  
      const data = await response.json();
      
      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Updated",
          text: `Leave request has been ${status}.`,
          timer: 2000,
          showConfirmButton: false,
        });
  
        fetchLeaveHistory(); // Refresh table after update
        setSelectedRequest(null); // Close modal
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.error || "Failed to update leave request.",
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while updating leave request.",
      });
    }
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
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">Leave Type</th>
                  <th className="px-4 py-2 text-left">Start Date</th>
                  <th className="px-4 py-2 text-left">End Date</th>
                  <th className="px-4 py-2 text-left">Total Days</th>
                  <th className="px-4 py-2 text-left">Reason</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {leaveRequests.map((request) => (
                  <tr key={request.id}>
                    <td className="px-4 py-2">{request.id}</td>
                    <td className="px-4 py-2">{request.leaveType}</td>
                    <td className="px-4 py-2">
                      {new Date(request.startDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">
                      {new Date(request.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">
                      {calculateTotalDays(request.startDate, request.endDate)} days
                    </td>
                    <td className="px-4 py-2">{request.reason}</td>
                    <td className="px-4 py-2">{request.status}</td>
                    <td className="px-4 py-2">
                      <button
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
                        onClick={() => handleEditClick(request)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No leave requests found.</p>
          )}
        </div>
      </div>

   {/* Edit Modal */}
{selectedRequest && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
      <h2 className="text-xl font-bold mb-4">Edit Leave Status</h2>
      <p className="mb-2"><strong>Current Status:</strong> {selectedRequest.status}</p>
      <p><strong>Requested By:</strong> {selectedRequest.user_name}</p>
      <p><strong>Leave Type:</strong> {selectedRequest.leaveType}</p>
      <p><strong>Start Date:</strong> {new Date(selectedRequest.start_date).toLocaleDateString()}</p>
      <p><strong>End Date:</strong> {new Date(selectedRequest.end_date).toLocaleDateString()}</p>
      <p><strong>Total Days:</strong> {calculateTotalDays(selectedRequest.start_date, selectedRequest.end_date)} days</p>
      <p><strong>Reason:</strong> {selectedRequest.reason}</p>

      {/* Status Selection Buttons */}
      {isWithin24Hours(selectedRequest.created_at) && (
        <div className="flex justify-between mt-4">
          <button
            onClick={() => updateLeaveStatus("approved")}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded w-1/2 mr-2"
          >
            Approve
          </button>
          <button
             onClick={() => updateLeaveStatus("rejected")}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded w-1/2 ml-2"
          >
            Reject
          </button>
        </div>
      )}

      {/* Close Button */}
      <div className="flex justify-end mt-4">
        <button
         onClick={() => setSelectedRequest(null)}
          className="bg-gray-300 px-4 py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default HistoryConfirm;
