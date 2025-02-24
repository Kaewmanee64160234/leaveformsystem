import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  Container,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";

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
  const [loading, setLoading] = useState(true);

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

  const updateLeaveStatus = async (status) => {
    if (!selectedRequest) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/leave-requests/${selectedRequest.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
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

        fetchLeaveHistory();
        setSelectedRequest(null);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.error || "Failed to update leave request.",
        });
      }
    } catch  {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while updating leave request.",
      });
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
                  <TableCell>Leave Type</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>End Date</TableCell>
                  <TableCell>Total Days</TableCell>
                  <TableCell>Reason</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leaveRequests.map((request) => (
                  <TableRow key={request.id} hover>
                    <TableCell>{request.id}</TableCell>
                    <TableCell>{request.leaveType}</TableCell>
                    <TableCell>{new Date(request.startDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(request.endDate).toLocaleDateString()}</TableCell>
                    <TableCell>{calculateTotalDays(request.startDate, request.endDate)} days</TableCell>
                    <TableCell>{request.reason}</TableCell>
                    <TableCell>{request.status}</TableCell>
                    <TableCell>
                      <Button variant="contained" color="primary" onClick={() => setSelectedRequest(request)}>
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography textAlign="center" color="gray">
            No leave requests found.
          </Typography>
        )}
      </Paper>

      {/* Edit Modal */}
      <Dialog open={Boolean(selectedRequest)} onClose={() => setSelectedRequest(null)}>
        <DialogTitle>Edit Leave Status</DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <>
              <Typography><strong>Current Status:</strong> {selectedRequest.status}</Typography>
              <Typography><strong>Requested By:</strong> {selectedRequest.user_name}</Typography>
              <Typography><strong>Total Days:</strong> {calculateTotalDays(selectedRequest.startDate, selectedRequest.endDate)} days</Typography>
              <Typography><strong>Reason:</strong> {selectedRequest.reason}</Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => updateLeaveStatus("approved")} color="success" variant="contained">
            Approve
          </Button>
          <Button onClick={() => updateLeaveStatus("rejected")} color="error" variant="contained">
            Reject
          </Button>
          <Button onClick={() => setSelectedRequest(null)} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default HistoryConfirm;
