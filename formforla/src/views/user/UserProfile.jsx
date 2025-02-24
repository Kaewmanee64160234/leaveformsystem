import { useState, useEffect } from "react";
import {
  Container,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  Avatar,
  Grid,
  Paper,
} from "@mui/material";
import { Email, Work, CalendarToday } from "@mui/icons-material";


const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const userData = storedUser ? JSON.parse(storedUser) : null;

        if (!userData) {
          alert("Please log in first.");
          return;
        }

        const response = await fetch(`http://localhost:5000/api/users/profile/${userData.id}`);
        const data = await response.json();

        if (response.ok) {
          setUser(data);
        } else {
          alert(data.error || "Failed to fetch user profile.");
        }
      } catch (err) {
        console.error(err);
        alert("An error occurred while fetching user profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "70vh",
        }}
      >
        <Card elevation={10} sx={{ borderRadius: 3, overflow: "hidden", width: "100%", maxWidth: 450 }}>
          {/* Profile Header */}
          <Box
            sx={{
              background: "linear-gradient(135deg, #50B498 0%,#468585 100%)",
              color: "white",
              textAlign: "center",
              p: 3,
            }}
          >
            <Avatar sx={{ width: 80, height: 80, margin: "0 auto", bgcolor: "white", color: "blue" }}>
              {user?.name.charAt(0)}
            </Avatar>
            <Typography variant="h5" fontWeight="bold" mt={1}>
              {loading ? <CircularProgress size={24} color="inherit" /> : user?.name}
            </Typography>
            <Typography variant="subtitle1">{user?.role}</Typography>
          </Box>

          {/* Profile Details */}
          <CardContent sx={{ textAlign: "left", p: 4 }}>
            {loading ? (
              <Box textAlign="center">
                <CircularProgress />
              </Box>
            ) : (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Paper elevation={3} sx={{ p: 2, display: "flex", alignItems: "center" }}>
                    <Email sx={{ mr: 2, color: "#007bff" }} />
                    <Typography variant="body1">
                      <strong>Email:</strong> {user?.email}
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <Paper elevation={3} sx={{ p: 2, display: "flex", alignItems: "center" }}>
                    <Work sx={{ mr: 2, color: "#28a745" }} />
                    <Typography variant="body1">
                      <strong>Role:</strong> {user?.role}
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <Paper elevation={3} sx={{ p: 2, display: "flex", alignItems: "center" }}>
                    <CalendarToday sx={{ mr: 2, color: "#ffc107" }} />
                    <Typography variant="body1">
                      <strong>Leave Balance:</strong> {user?.leave_balance} days
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            )}
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default UserProfile;