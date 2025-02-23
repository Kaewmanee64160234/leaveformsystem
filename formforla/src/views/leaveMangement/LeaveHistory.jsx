import { useState, useEffect } from "react";
import NavBar from "../../components/NavBar";
import Swal from "sweetalert2";

const LeaveHistory = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [user, setUser] = useState(null);
  const [leaveBalance, setLeaveBalance] = useState(0);

  useEffect(() => {
    // Get current user from local storage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchLeaveHistory(parsedUser.id);
      fetchUserProfile(parsedUser.id);
    }
  }, []);

  // Fetch pending leave requests for the manager
  const fetchLeaveHistory = async (managerId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/leave-requests?status=pending&manager_id=${managerId}`
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

  // Fetch user leave balance
  const fetchUserProfile = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/users/profile/${userId}`
      );
      const data = await response.json();
      if (response.ok) {
        setLeaveBalance(data.leave_balance);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.error || "Failed to fetch user profile",
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while fetching user profile",
      });
    }
  };

  // Calculate total leave days
  const calculateTotalDays = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate - startDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Include both start and end dates
  };

  // Format date
  const formatDate = (dateStr) => {
    return dateStr ? new Date(dateStr).toLocaleDateString() : "-";
  };

  // Approve or Reject Leave Request
  const updateLeaveStatus = async (requestId, newStatus, totalDays, userId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/leave-requests/${requestId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Updated",
          text: `Leave request ${newStatus}.`,
          timer: 2000,
          showConfirmButton: false,
        });

        // If approved, update leave balance
        if (newStatus === "approved") {
          updateUserLeaveBalance(userId, totalDays);
        }

        fetchLeaveHistory(user.id); // Refresh leave requests
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.error || "Failed to update leave request",
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while updating leave request",
      });
    }
  };

  // Deduct leave days from leave balance
  const updateUserLeaveBalance = async (userId, totalDays) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/users/update-balance/${userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ daysUsed: totalDays }),
        }
      );

      if (response.ok) {
        setLeaveBalance((prevBalance) => prevBalance - totalDays);
      } else {
        console.error("Failed to update leave balance.");
      }
    } catch (err) {
      console.error("Error updating leave balance:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <div className="p-4">
        <header className="mb-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Leave History</h1>
          <p className="text-lg font-semibold">
            🏖️ Leave Balance:{" "}
            <span className="text-blue-500">{leaveBalance} days</span>
          </p>
        </header>
        <div className="bg-white shadow rounded p-4 overflow-x-auto">
          {leaveRequests.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">Name of Employee</th>
                  <th className="px-4 py-2 text-left">Leave Type</th>
                  <th className="px-4 py-2 text-left">Start Date</th>
                  <th className="px-4 py-2 text-left">End Date</th>
                  <th className="px-4 py-2 text-left">Total Days</th>
                  <th className="px-4 py-2 text-left">Leave Balance</th>
                  <th className="px-4 py-2 text-left">Reason</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {leaveRequests.map((request, index) => (
                  <tr key={index + 1}>
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{request.user_name}</td>
                    <td className="px-4 py-2">{request.leaveType}</td>
                    <td className="px-4 py-2">
                      {formatDate(request.startDate)}
                    </td>
                    <td className="px-4 py-2">{formatDate(request.endDate)}</td>
                    <td className="px-4 py-2">
                      {calculateTotalDays(request.startDate, request.endDate)}{" "}
                      days
                    </td>
                    <td className="px-4 py-2">{request.leave_balance} days</td>
                    <td className="px-4 py-2">{request.reason}</td>
                    <td className="px-4 py-2">{request.status}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() =>
                          updateLeaveStatus(
                            request.id,
                            "approved",
                            calculateTotalDays(
                              request.startDate,
                              request.endDate
                            ),
                            request.user_id
                          )
                        }
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded mr-2"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() =>
                          updateLeaveStatus(
                            request.id,
                            "rejected",
                            0,
                            request.user_id
                          )
                        }
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No pending leave requests.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaveHistory;
