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
          throw new Error("Failed to fetch data");
        }

        const leaveData = await leaveResponse.json();
        const managerData = await managerResponse.json();

        setLeaveTypes(leaveData);
        setManagers(managerData);
      } catch  {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error occurred while fetching data.",
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
        title: "Validation Error",
        text: "Start date must be before or equal to the end date.",
      });
      return;
    }

    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    if (!user) {
      Swal.fire({
        icon: "error",
        title: "Not Authenticated",
        text: "Please log in first.",
      });
      navigate("/login");
      return;
    }

    if (!managerId) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please select a manager.",
      });
      return;
    }

    try {
      const checkResponse = await fetch(`http://localhost:5000/api/leave-requests/user/${user.id}/latest`);
      const latestRequest = await checkResponse.json();

      if (checkResponse.ok && latestRequest && latestRequest.status === "pending") {
        Swal.fire({
          icon: "warning",
          title: "Pending Request Exists",
          text: "You already have a pending leave request. Please wait for approval before submitting a new one.",
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
          title: "Submitted",
          text: "Leave request submitted successfully!",
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
          title: "Submission Failed",
          text: data.error || "Unable to submit leave request.",
        });
      }
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred. Please try again later.",
      });
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h5" fontWeight="bold" textAlign="center" gutterBottom>
            Apply for Leave
          </Typography>

          {loading ? (
            <Grid container justifyContent="center" sx={{ mt: 2 }}>
              <CircularProgress />
            </Grid>
          ) : (
            <form onSubmit={handleSubmit}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Leave Type</InputLabel>
                <Select value={leaveType} onChange={(e) => setLeaveType(e.target.value)} required>
                  <MenuItem value="">Select a leave type</MenuItem>
                  {leaveTypes.map((type) => (
                    <MenuItem key={type.id} value={type.id}>
                      {type.type_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel>Manager</InputLabel>
                <Select value={managerId} onChange={(e) => setManagerId(e.target.value)} required>
                  <MenuItem value="">Select a manager</MenuItem>
                  {managers.map((manager) => (
                    <MenuItem key={manager.id} value={manager.id}>
                      {manager.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                margin="normal"
                required
              />

              <TextField
                fullWidth
                label="End Date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                margin="normal"
                required
              />

              <TextField
                fullWidth
                label="Reason"
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
                Submit Leave Request
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default CreateLeaveRequest;
