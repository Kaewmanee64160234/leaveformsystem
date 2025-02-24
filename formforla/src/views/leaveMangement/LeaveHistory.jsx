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
  Chip,
  Box,
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
    } catch {
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
    } catch {
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
     <Typography variant="h5" fontWeight="bold" textAlign="start" sx={{ mb: 2 }}>
        Leave History
      </Typography>

      <Paper sx={{ padding: 2, boxShadow: 3, borderRadius: 2 }}>
        {loading ? (
          <Box textAlign="center" py={3}>
            <CircularProgress />
          </Box>
        ) : leaveRequests.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#50B498" }}>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>ID</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Employee</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Leave Type</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Start Date</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>End Date</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Total Days</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Leave Balance</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Reason</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Status</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Actions</TableCell>
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
                    {/* ✅ Status Color Code */}
                    <TableCell>
                      <Chip
                        label={request.status}
                        sx={{
                          backgroundColor:
                            request.status === "approved"
                              ? "#4CAF50" // Green
                              : request.status === "rejected"
                              ? "#E57373" // Red
                              : "#FFA726", // Orange (Pending)
                          color: "white",
                          fontWeight: "bold",
                        }}
                      />
                    </TableCell>
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
                        size="small"
                        sx={{ mr: 1, color: "white", width: "80px" }}
                      >
                        Approve
                      </Button>
                      <Button
                        onClick={() => updateLeaveStatus(request.id, "rejected", 0, request.user_id)}
                        variant="contained"
                        color="error"
                        size="small"
                        sx={{ color: "white", width: "80px" }}
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
