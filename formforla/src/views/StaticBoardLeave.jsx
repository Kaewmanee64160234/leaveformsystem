import { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
} from "@mui/material";
import { People, TrendingUp, TrendingDown } from "@mui/icons-material";

const StaticBoardLeave = () => {
  const [mostLeaveBalance, setMostLeaveBalance] = useState([]);
  const [leastLeaveBalance, setLeastLeaveBalance] = useState([]);
  const [mostUsedLeaveType, setMostUsedLeaveType] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responses = await Promise.all([
          fetch("http://localhost:5000/api/employees/most-leave-balance"),
          fetch("http://localhost:5000/api/employees/least-leave-balance"),
          fetch("http://localhost:5000/api/employees/most-used-leave-type"),
        ]);

        const [mostBalance, leastBalance, usedLeave] = await Promise.all(responses.map(res => res.json()));

        setMostLeaveBalance(mostBalance);
        setLeastLeaveBalance(leastBalance);
        setMostUsedLeaveType(usedLeave);
      } catch (error) {
        console.error("Error fetching leave statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" fontWeight="bold" textAlign="center" sx={{ mb: 4, color: "#50B498" }}>
        Leave Statistics Board
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={4}>
          {/* Most Leave Balance */}
          <Grid item xs={12} md={4}>
            <Card elevation={4} sx={{ borderRadius: 3 }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <People sx={{ fontSize: 40, color: "#50B498" }} />
                  <Typography variant="h6" fontWeight="bold">
                    Employees with Most Leave Balance
                  </Typography>
                </Box>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: "#e8f5e9" }}>
                        <TableCell>Name</TableCell>
                        <TableCell align="right">Leave Days</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {mostLeaveBalance.map((emp, index) => (
                        <TableRow key={index}>
                          <TableCell>{emp.name}</TableCell>
                          <TableCell align="right">{emp.leave_balance} days</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Least Leave Balance */}
          <Grid item xs={12} md={4}>
            <Card elevation={4} sx={{ borderRadius: 3 }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <TrendingDown sx={{ fontSize: 40, color: "#ff9800" }} />
                  <Typography variant="h6" fontWeight="bold">
                    Employees with Least Leave Balance
                  </Typography>
                </Box>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: "#fff3e0" }}>
                        <TableCell>Name</TableCell>
                        <TableCell align="right">Leave Days</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {leastLeaveBalance.map((emp, index) => (
                        <TableRow key={index}>
                          <TableCell>{emp.name}</TableCell>
                          <TableCell align="right">{emp.leave_balance} days</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Most Used Leave Type */}
          <Grid item xs={12} md={4}>
            <Card elevation={4} sx={{ borderRadius: 3 }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <TrendingUp sx={{ fontSize: 40, color: "#1976d2" }} />
                  <Typography variant="h6" fontWeight="bold">
                    Most Used Leave Type
                  </Typography>
                </Box>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: "#e3f2fd" }}>
                        <TableCell>Type</TableCell>
                        <TableCell align="right">Times Used</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {mostUsedLeaveType.map((type, index) => (
                        <TableRow key={index}>
                          <TableCell>{type.type_name}</TableCell>
                          <TableCell align="right">{type.count} times</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default StaticBoardLeave;
