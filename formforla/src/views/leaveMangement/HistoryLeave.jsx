// src/components/ManagerLeaveApproval.jsx
import { useState, useEffect } from "react";
import NavBar from "../../components/NavBar";
import Swal from "sweetalert2";

const ManagerLeaveApproval = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  // Fetch pending leave requests (assumed status 'pending')
  const fetchLeaveRequests = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/leave-requests?status=pending");
      const data = await response.json();
      if (response.ok) {
        setLeaveRequests(data);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.error || "Failed to fetch leave requests."
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while fetching leave requests."
      });
    } finally {
      setLoading(false);
    }
  };

  // Calculate total leave days (inclusive)
  const calculateTotalDays = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    // Calculate difference in milliseconds, then convert to days
    const diffTime = endDate - startDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  // Handler for when a row is clicked
  const handleRowClick = (request) => {
    setSelectedRequest(request);
  };

  // Update the leave request status (approved or rejected)
  const updateStatus = async (newStatus) => {
    if (!selectedRequest) return;
    try {
      const response = await fetch(`http://localhost:5000/api/leave-requests/${selectedRequest.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await response.json();
      console.log(data);
      
      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Updated",
          text: `Leave request ${newStatus}.`,
          timer: 2000,
          showConfirmButton: false
        });
        // Refresh the leave requests list
        fetchLeaveRequests();
        // Close modal
        setSelectedRequest(null);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.error || "Failed to update leave request."
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while updating leave request."
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Pending Leave Requests</h1>
        {loading ? (
          <p>Loading...</p>
        ) : leaveRequests.length === 0 ? (
          <p>No pending leave requests found.</p>
        ) : (
          <div className="bg-white shadow rounded p-4 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">Employee</th>
                  <th className="px-4 py-2 text-left">Leave Type</th>
                  <th className="px-4 py-2 text-left">Start Date</th>
                  <th className="px-4 py-2 text-left">End Date</th>
                  <th className="px-4 py-2 text-left">Total Days</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {leaveRequests.map((request,index) => (
                  <tr key={index} 
                      onClick={() => handleRowClick(request)}
                      className="cursor-pointer hover:bg-gray-100">
                    <td className="px-4 py-2">{index+1}</td>
                    <td className="px-4 py-2">{request.user_name}</td>
                    <td className="px-4 py-2">{request.leaveType}</td>
                    <td className="px-4 py-2">{new Date(request.startDate).toLocaleDateString()}</td>
                    <td className="px-4 py-2">{new Date(request.endDate).toLocaleDateString()}</td>
                    <td className="px-4 py-2">{calculateTotalDays(request.startDate, request.endDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal for approval */}
      {selectedRequest && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Leave Request Details</h2>
            <p><strong>Employee:</strong> {selectedRequest.user_name}</p>
            <p><strong>Leave Type:</strong> {selectedRequest.leaveType}</p>
            <p>
              <strong>Start Date:</strong>{" "}
              {new Date(selectedRequest.startDate).toLocaleDateString()}
            </p>
            <p>
              <strong>End Date:</strong>{" "}
              {new Date(selectedRequest.endDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Total Days:</strong>{" "}
              {calculateTotalDays(selectedRequest.startDate, selectedRequest.endDate)}
            </p>
            <p><strong>Reason:</strong> {selectedRequest.reason}</p>
            <p><strong>Status:</strong> {selectedRequest.status}</p>
            <div className="mt-4 flex justify-end space-x-4">
              <button 
                onClick={() => setSelectedRequest(null)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button 
                onClick={() => updateStatus("approved")}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              >
                Approve
              </button>
              <button 
                onClick={() => updateStatus("rejected")}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerLeaveApproval;
