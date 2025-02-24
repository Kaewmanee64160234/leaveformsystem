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
          title: "อัปเดตแล้ว",
          text: `คำขอลาได้รับการ${newStatus}แล้ว`,
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
        console.error("ไม่สามารถอัปเดตยอดวันลาคงเหลือได้");
      }
    } catch (err) {
      console.error("เกิดข้อผิดพลาดขณะอัปเดตยอดวันลาคงเหลือ:", err);
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
          <Box display="flex" justifyContent="center">
            <TableContainer sx={{ width: "100%" }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#50B498" }}>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>ID</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>พนักงาน</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>ประเภทการลา</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>วันที่เริ่ม</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>วันที่สิ้นสุด</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>จำนวนวัน</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>ยอดวันลาคงเหลือ</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>เหตุผล</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>สถานะ</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>การกระทำ</TableCell>
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
                      <TableCell>{calculateTotalDays(request.startDate, request.endDate)} วัน</TableCell>
                      <TableCell>{request.leave_balance} วัน</TableCell>
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
                          อนุมัติ
                        </Button>
                        <Button
                          onClick={() => updateLeaveStatus(request.id, "rejected", 0, request.user_id)}
                          variant="contained"
                          color="error"
                          size="small"
                          sx={{ color: "white", width: "80px" }}
                        >
                          ปฏิเสธ
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ) : (
          <Typography textAlign="center" color="gray">
            ไม่มีคำขอลาที่รอดำเนินการ
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default LeaveHistory;
