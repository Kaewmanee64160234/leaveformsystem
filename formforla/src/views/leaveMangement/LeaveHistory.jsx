import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  Container,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  CircularProgress,
  Button,
} from "@mui/material";

const LeaveHistory = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get logged-in user ID
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
  const user_id = user ? user.id : null;

  useEffect(() => {
    fetchLeaveHistory();
  }, []);

  const fetchLeaveHistory = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/leave-requests?status=pending");
      const data = await response.json();

      if (response.ok) {
        const filteredRequests = data.filter(request => request.user_id !== user_id);
        setLeaveRequests(filteredRequests);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.error || "Failed to fetch leave history",
        });
      }
    } catch  {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while fetching leave history",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalDays = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate - startDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const formatDate = (dateStr) => {
    return dateStr ? new Date(dateStr).toLocaleDateString() : "-";
  };

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

        if (newStatus === "approved") {
          updateUserLeaveBalance(userId, totalDays);
        }

        fetchLeaveHistory();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.error || "Failed to update leave request",
        });
      }
    } catch  {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while updating leave request",
      });
    }
  };

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

      if (!response.ok) {
        console.error("Failed to update leave balance.");
      }
    } catch (err) {
      console.error("Error updating leave balance:", err);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" fontWeight="bold" textAlign="center" sx={{ mb: 4 }}>
        Leave History
      </Typography>

      <Paper sx={{ padding: 2, boxShadow: 3, borderRadius: 2 }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <CircularProgress />
          </div>
        ) : leaveRequests.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Employee</TableCell>
                  <TableCell>Leave Type</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>End Date</TableCell>
                  <TableCell>Total Days</TableCell>
                  <TableCell>Leave Balance</TableCell>
                  <TableCell>Reason</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leaveRequests.map((request, index) => (
                  <TableRow key={request.id} hover>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{request.user_name}</TableCell>
                    <TableCell>{request.leaveType}</TableCell>
                    <TableCell>{formatDate(request.startDate)}</TableCell>
                    <TableCell>{formatDate(request.endDate)}</TableCell>
                    <TableCell>{calculateTotalDays(request.startDate, request.endDate)} days</TableCell>
                    <TableCell>{request.leave_balance} days</TableCell>
                    <TableCell>{request.reason}</TableCell>
                    <TableCell>{request.status}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() =>
                          updateLeaveStatus(
                            request.id,
                            "approved",
                            calculateTotalDays(request.startDate, request.endDate),
                            request.user_id
                          )
                        }
                        variant="contained"
                        color="success"
                        sx={{ mr: 1 }}
                      >
                        Approve
                      </Button>
                      <Button
                        onClick={() => updateLeaveStatus(request.id, "rejected", 0, request.user_id)}
                        variant="contained"
                        color="error"
                      >
                        Reject
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography textAlign="center" color="gray">
            No pending leave requests.
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default LeaveHistory;
