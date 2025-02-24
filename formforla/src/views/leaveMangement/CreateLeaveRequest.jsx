import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Grid,
  CircularProgress,
} from "@mui/material";

const CreateLeaveRequest = () => {
  const [leaveType, setLeaveType] = useState("");
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [managerId, setManagerId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const leaveResponse = await fetch("http://localhost:5000/api/leave-types");
        const managerResponse = await fetch("http://localhost:5000/api/users/managers");

        if (!leaveResponse.ok || !managerResponse.ok) {
          throw new Error("ไม่สามารถดึงข้อมูลได้");
        }

        const leaveData = await leaveResponse.json();
        const managerData = await managerResponse.json();

        setLeaveTypes(leaveData);
        setManagers(managerData);
      } catch  {
        Swal.fire({
          icon: "error",
          title: "ข้อผิดพลาด",
          text: "เกิดข้อผิดพลาดขณะดึงข้อมูล",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (new Date(startDate) > new Date(endDate)) {
      Swal.fire({
        icon: "error",
        title: "ข้อผิดพลาดในการตรวจสอบ",
        text: "วันที่เริ่มต้องมาก่อนหรือเท่ากับวันที่สิ้นสุด",
      });
      return;
    }

    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    if (!user) {
      Swal.fire({
        icon: "error",
        title: "ไม่ได้รับการยืนยันตัวตน",
        text: "กรุณาเข้าสู่ระบบก่อน",
      });
      navigate("/login");
      return;
    }

    if (!managerId) {
      Swal.fire({
        icon: "error",
        title: "ข้อผิดพลาดในการตรวจสอบ",
        text: "กรุณาเลือกผู้จัดการ",
      });
      return;
    }

    try {
      const checkResponse = await fetch(`http://localhost:5000/api/leave-requests/user/${user.id}/latest`);
      const latestRequest = await checkResponse.json();

      if (checkResponse.ok && latestRequest && latestRequest.status === "pending") {
        Swal.fire({
          icon: "warning",
          title: "มีคำขอที่รอดำเนินการอยู่",
          text: "คุณมีคำขอลาที่รอดำเนินการอยู่แล้ว กรุณารอการอนุมัติก่อนที่จะส่งคำขอใหม่",
        });
        return;
      }

      const payload = {
        user_id: user.id,
        manager_id: managerId,
        leave_type_id: leaveType,
        startDate,
        endDate,
        reason,
      };

      const response = await fetch("http://localhost:5000/api/leave-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "ส่งคำขอแล้ว",
          text: "คำขอลาถูกส่งเรียบร้อยแล้ว!",
          timer: 2000,
          showConfirmButton: false,
        });

        setLeaveType("");
        setManagerId("");
        setStartDate("");
        setEndDate("");
        setReason("");
        navigate("/leave-history");
      } else {
        Swal.fire({
          icon: "error",
          title: "การส่งคำขอล้มเหลว",
          text: data.error || "ไม่สามารถส่งคำขอลาได้",
        });
      }
    } catch {
      Swal.fire({
        icon: "error",
        title: "ข้อผิดพลาด",
        text: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้งในภายหลัง",
      });
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h5" fontWeight="bold" textAlign="center" gutterBottom>
            ขอการลา
          </Typography>

          {loading ? (
            <Grid container justifyContent="center" sx={{ mt: 2 }}>
              <CircularProgress />
            </Grid>
          ) : (
            <form onSubmit={handleSubmit}>
              <FormControl fullWidth margin="normal">
                <InputLabel>ประเภทการลา</InputLabel>
                <Select value={leaveType} onChange={(e) => setLeaveType(e.target.value)} required>
                  <MenuItem value="">เลือกประเภทการลา</MenuItem>
                  {leaveTypes.map((type) => (
                    <MenuItem key={type.id} value={type.id}>
                      {type.type_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel>ผู้จัดการ</InputLabel>
                <Select value={managerId} onChange={(e) => setManagerId(e.target.value)} required>
                  <MenuItem value="">เลือกผู้จัดการ</MenuItem>
                  {managers.map((manager) => (
                    <MenuItem key={manager.id} value={manager.id}>
                      {manager.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="วันที่เริ่ม"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                margin="normal"
                required
              />

              <TextField
                fullWidth
                label="วันที่สิ้นสุด"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                margin="normal"
                required
              />

              <TextField
                fullWidth
                label="เหตุผล"
                multiline
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                margin="normal"
                required
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2, py: 1 }}
              >
                ส่งคำขอลา
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default CreateLeaveRequest;
