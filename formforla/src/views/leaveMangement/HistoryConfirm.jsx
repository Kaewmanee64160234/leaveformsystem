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
  Box,
} from "@mui/material";

const HistoryConfirm = () => {
  // Calculate total days between two dates
  const calculateTotalDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const [leaveRequests, setLeaveRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionStatus, setActionStatus] = useState(""); // "approved" or "rejected"
  const [loading, setLoading] = useState(true);

  // Get logged-in user ID
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
  const user_id = user ? user.id : null;

  useEffect(() => {
    if (user_id) {
      fetchLeaveHistory();
    }
  }, [user_id]);

  const fetchLeaveHistory = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/leave-requests/history/${user_id}`);
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

  const handleOpenDialog = (request, status) => {
    setSelectedRequest(request);
    setActionStatus(status); // "approved" or "rejected"
  };

  // Update leave status after user confirms in the dialog
  const handleConfirmStatus = async () => {
    if (!selectedRequest) return;
    try {
      const response = await fetch(
        `http://localhost:5000/api/leave-requests/${selectedRequest.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: actionStatus }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Updated",
          text: `Leave request has been ${actionStatus}.`,
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
    } catch {
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
          <Box textAlign="center" py={3}>
            <CircularProgress />
          </Box>
        ) : leaveRequests.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#50B498" }}>
                  <TableCell sx={{ color: "white", fontWeight: "bold" ,textAlign:'center'}}>ID</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" ,textAlign:'center'}}>Leave Type</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" ,textAlign:'center'}}>Start Date</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" ,textAlign:'center'}}>End Date</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" ,textAlign:'center'}}>Total Days</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" ,textAlign:'center'}}>Reason</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" ,textAlign:'center'}}>Status</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" ,textAlign:'center'}}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leaveRequests.map((request,index) => (
                  <TableRow key={request.id} hover>
                    <TableCell>{index+1}</TableCell>
                    <TableCell>{request.leaveType}</TableCell>
                    <TableCell>
                      {new Date(request.startDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(request.endDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {calculateTotalDays(request.startDate, request.endDate)} days
                    </TableCell>
                    <TableCell>{request.reason}</TableCell>
                    <TableCell>{request.status}</TableCell>
                    <TableCell>
                      {/* If status is "approved", show "Reject" button; otherwise show "Approve" */}
                      {request.status === "approved" ? (
                        <Button
                          onClick={() => handleOpenDialog(request, "rejected")}
                          color="error"
                          variant="contained"
                          size="small"
                        >
                          Reject
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleOpenDialog(request, "approved")}
                          color="success"
                          variant="contained"
                          size="small"
                        >
                          Approve
                        </Button>
                      )}
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

      {/* 🔥 Confirmation Dialog */}
      <Dialog
        open={Boolean(selectedRequest)}
        onClose={() => setSelectedRequest(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            backgroundColor: "#50B498",
            color: "white",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          Confirm to {actionStatus === "approved" ? "Approve" : "Reject"}?
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          {selectedRequest && (
            <>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Leave Type:</strong> {selectedRequest.leaveType}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Start Date:</strong>{" "}
                {new Date(selectedRequest.startDate).toLocaleDateString()}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>End Date:</strong>{" "}
                {new Date(selectedRequest.endDate).toLocaleDateString()}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Total Days:</strong>{" "}
                {calculateTotalDays(selectedRequest.startDate, selectedRequest.endDate)}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Reason:</strong> {selectedRequest.reason}
              </Typography>
              <Typography variant="body1">
                <strong>Current Status:</strong> {selectedRequest.status}
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button
            variant="contained"
            color="success"
            onClick={handleConfirmStatus}
            sx={{ mr: 2 }}
          >
            Confirm
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setSelectedRequest(null)}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default HistoryConfirm;
