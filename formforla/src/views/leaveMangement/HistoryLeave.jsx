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
  Box,
  Chip,
} from "@mui/material";

const HistoryLeave = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);

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
        Swal.fire({ icon: "error", title: "ข้อผิดพลาด", text: "กรุณาเข้าสู่ระบบก่อน" });
        return;
      }

      const response = await fetch(`http://localhost:5000/api/leave-requests/user/${user.id}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setLeaveRequests(data);
    } catch {
      Swal.fire({ icon: "error", title: "ข้อผิดพลาด", text: "เกิดข้อผิดพลาดขณะดึงข้อมูลประวัติการลา" });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    return dateStr ? new Date(dateStr).toLocaleDateString() : "-";
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
                  <TableCell sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}>อนุมัติโดย</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leaveRequests.map((request, index) => (
                  <TableRow key={index} hover>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{request.leaveType}</TableCell>
                    <TableCell>{formatDate(request.start_date)}</TableCell>
                    <TableCell>{formatDate(request.end_date)}</TableCell>
                    <TableCell>
                      {Math.ceil((new Date(request.end_date) - new Date(request.start_date)) / (1000 * 60 * 60 * 24)) + 1} วัน
                    </TableCell>
                    <TableCell>{request.reason}</TableCell>
                    {/* ✅ Status Styling with Colors */}
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
                    <TableCell>{request.approved_by || "รอดำเนินการ"}</TableCell>
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
    </Container>
  );
};

export default HistoryLeave;
