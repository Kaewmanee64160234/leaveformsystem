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
  Chip,
  Box,
} from "@mui/material";

const HistoryConfirm = () => {
  // Calculate total days between two dates
  const calculateTotalDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
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
          title: "ข้อผิดพลาด",
          text: data.error || "ไม่สามารถดึงข้อมูลประวัติการลาได้",
        });
      }
    } catch {
      Swal.fire({
        icon: "error",
        title: "ข้อผิดพลาด",
        text: "เกิดข้อผิดพลาดขณะดึงข้อมูลประวัติการลา",
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
          title: "อัปเดตแล้ว",
          text: `คำขอลาได้รับการ${actionStatus}แล้ว`,
          timer: 2000,
          showConfirmButton: false,
        });
        fetchLeaveHistory();
        setSelectedRequest(null);
      } else {
        Swal.fire({
          icon: "error",
          title: "ข้อผิดพลาด",
          text: data.error || "ไม่สามารถอัปเดตคำขอลาได้",
        });
      }
    } catch {
      Swal.fire({
        icon: "error",
        title: "ข้อผิดพลาด",
        text: "เกิดข้อผิดพลาดขณะอัปเดตคำขอลา",
      });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h5" fontWeight="bold" textAlign="start" sx={{ mb: 2 }}>
        ประวัติการลา
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
                  <TableCell sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}>ID</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}>ประเภทการลา</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}>วันที่เริ่ม</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}>วันที่สิ้นสุด</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}>จำนวนวัน</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}>เหตุผล</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}>สถานะ</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}>การกระทำ</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leaveRequests.map((request, index) => (
                  <TableRow key={request.id} hover>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{request.leaveType}</TableCell>
                    <TableCell>{new Date(request.startDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(request.endDate).toLocaleDateString()}</TableCell>
                    <TableCell>{calculateTotalDays(request.startDate, request.endDate)} วัน</TableCell>
                    <TableCell>{request.reason}</TableCell>
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
                      {request.status === "approved" ? (
                        <Button
                          onClick={() => handleOpenDialog(request, "rejected")}
                          color="error"
                          variant="contained"
                          size="small"
                          style={{ width: "80px" }}
                        >
                          ปฏิเสธ
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleOpenDialog(request, "approved")}
                          color="success"
                          variant="contained"
                          size="small"
                          style={{ width: "80px" }}
                        >
                          อนุมัติ
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
            ไม่พบคำขอลา
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
          ยืนยันการ{actionStatus === "approved" ? "อนุมัติ" : "ปฏิเสธ"}?
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          {selectedRequest && (
            <>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>ประเภทการลา:</strong> {selectedRequest.leaveType}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>วันที่เริ่ม:</strong> {new Date(selectedRequest.startDate).toLocaleDateString()}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>วันที่สิ้นสุด:</strong> {new Date(selectedRequest.endDate).toLocaleDateString()}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>จำนวนวัน:</strong> {calculateTotalDays(selectedRequest.startDate, selectedRequest.endDate)}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>เหตุผล:</strong> {selectedRequest.reason}
              </Typography>
              <Typography variant="body1">
                <strong>สถานะปัจจุบัน:</strong> {selectedRequest.status}
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
            ยืนยัน
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setSelectedRequest(null)}
          >
            ยกเลิก
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default HistoryConfirm;
