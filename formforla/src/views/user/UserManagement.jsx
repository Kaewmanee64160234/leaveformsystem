import { useEffect, useState } from "react";
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
  TextField,
  CircularProgress,
  Box,
} from "@mui/material";

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [search]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/users?search=${search}`);
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
     <Typography variant="h5" fontWeight="bold" textAlign="start" sx={{ mb: 2 }}>
        User Management
      </Typography>

      {/* Search Input - Aligned Left */}
      <Box display="flex" justifyContent="flex-start" sx={{ mb: 2 }}>
        <TextField
          label="ค้นหาด้วยชื่อหรืออีเมล..."
          variant="outlined"
          sx={{ width: 350 }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Box>

      {/* User Table */}
      <Paper sx={{ padding: 2, boxShadow: 3, borderRadius: 2 }}>
        {loading ? (
          <Box textAlign="center" sx={{ padding: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer sx={{ borderRadius: "8px", overflow: "hidden" }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#50B498" }}>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>ID</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>ชื่อ</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>อีเมล</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>บทบาท</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }} align="right">
                    วันลาคงเหลือ
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.length > 0 ? (
                  users.map((user, index) => (
                    <TableRow key={user.id} hover sx={{ "&:nth-of-type(odd)": { backgroundColor: "#f8f9fa" } }}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          color: user.role === "employee" ? "#1976d2" : "#d32f2f",
                        }}
                      >
                        {user.role === "employee" ? "พนักงาน" : "ผู้จัดการ"}
                      </TableCell>
                      <TableCell align="right">{user.leave_balance} วัน</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      ไม่พบข้อมูล
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Container>
  );
};

export default UserPage;
