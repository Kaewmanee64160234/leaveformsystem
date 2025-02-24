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
      <Typography variant="h4" fontWeight="bold" textAlign="center" sx={{ mb: 4 }}>
        User Management
      </Typography>

      {/* Search Input */}
      <Box display="flex" justifyContent="center" sx={{ mb: 3 }}>
        <TextField
          label="🔍 ค้นหาด้วยชื่อหรืออีเมล..."
          variant="outlined"
          fullWidth
          sx={{ maxWidth: 500 }}
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
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>ชื่อ</TableCell>
                  <TableCell>อีเมล</TableCell>
                  <TableCell>บทบาท</TableCell>
                  <TableCell align="right">วันลาคงเหลือ</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role === "employee" ? "พนักงาน" : "ผู้จัดการ"}</TableCell>
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
