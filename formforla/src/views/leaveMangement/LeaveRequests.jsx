import { useEffect, useState } from "react";
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
  TextField,
  Select,
  MenuItem,
  Button,
  Grid,
} from "@mui/material";

const LeaveRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter state variables
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/leave-requests");
        const data = await response.json();
        if (response.ok) {
          setRequests(data);
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: data.error || "Failed to fetch leave requests.",
          });
        }
      } catch {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error occurred while fetching leave requests.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // Filter logic: combine free-text search with dropdown filters
  const filteredRequests = requests.filter((req) => {
    const searchMatch = searchQuery
      ? (req.user_name && req.user_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (req.type_name && req.type_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (req.reason && req.reason.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;

    const statusMatch = filterStatus ? req.status.toLowerCase() === filterStatus.toLowerCase() : true;
    const typeMatch = filterType ? req.type_name && req.type_name.toLowerCase().includes(filterType.toLowerCase()) : true;
    const dateMatch = filterDate ? req.created_at && req.created_at.slice(0, 10) === filterDate : true;

    return searchMatch && statusMatch && typeMatch && dateMatch;
  });

  const clearFilters = () => {
    setSearchQuery("");
    setFilterStatus("");
    setFilterType("");
    setFilterDate("");
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" fontWeight="bold" textAlign="center" sx={{ mb: 4 }}>
        Leave Requests
      </Typography>

      {/* Filter/Search Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Search by name, type, or reason..."
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Select
              fullWidth
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              displayEmpty
            >
              <MenuItem value="">All Status</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12} md={3}>
            <Select
              fullWidth
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              displayEmpty
            >
              <MenuItem value="">All Leave Types</MenuItem>
              <MenuItem value="Vacation">Vacation</MenuItem>
              <MenuItem value="Sick">Sick</MenuItem>
              <MenuItem value="Personal">Personal</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              variant="outlined"
            />
          </Grid>
        </Grid>
        <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
          <Button variant="contained" color="error" onClick={clearFilters}>
            Clear Filters
          </Button>
        </Grid>
      </Paper>

      {loading ? (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <CircularProgress />
        </div>
      ) : filteredRequests.length === 0 ? (
        <Typography textAlign="center" color="gray">
          No leave requests found.
        </Typography>
      ) : (
        <Paper sx={{ padding: 2, boxShadow: 3, borderRadius: 2 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Leave Type</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>End Date</TableCell>
                  <TableCell>Reason</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Request Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRequests.map((req) => (
                  <TableRow key={req.id} hover>
                    <TableCell>{req.id}</TableCell>
                    <TableCell>{req.user_name}</TableCell>
                    <TableCell>{req.type_name || req.leave_type}</TableCell>
                    <TableCell>{req.start_date}</TableCell>
                    <TableCell>{req.end_date}</TableCell>
                    <TableCell>{req.reason}</TableCell>
                    <TableCell sx={{ textTransform: "capitalize" }}>{req.status}</TableCell>
                    <TableCell>{req.created_at && req.created_at.slice(0, 10)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Container>
  );
};

export default LeaveRequests;
