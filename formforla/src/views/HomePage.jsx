import { Container, Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#f0f0f0",
      }}
    >
      <Container maxWidth="md" sx={{ flexGrow: 1, textAlign: "center", mt: 8 }}>
        {/* Main Hero Section */}
        <Box
          sx={{
            background:
              "linear-gradient(135deg, #50B498 0%,#468585 100%)", // Gradient effect
            color: "white",
            py: 8,
            px: 4,
            borderRadius: 3,
            boxShadow: 3,
          }}
        >
          <Typography variant="h3" fontWeight="bold">
            ยินดีต้อนรับสู่ระบบจัดการการลา
          </Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>
            จัดการคำขอลาของพนักงานได้อย่างง่ายดายและมีประสิทธิภาพ
          </Typography>

          {/* Navigation Buttons */}
          <Box
            sx={{ mt: 4, display: "flex", justifyContent: "center", gap: 2 }}
          >
            <Button
              variant="contained"
              size="large"
              sx={{
                bgcolor: "white",
                color: "#50B498",
                "&:hover": { bgcolor: "#e0f2f1" },
              }}
              onClick={() => navigate("/create-leave-request")}
            >
              ขอการลา
            </Button>
            <Button
              variant="contained"
              size="large"
              sx={{
                bgcolor: "white",
                color: "#50B498",
                "&:hover": { bgcolor: "#e0f2f1" },
              }}
              onClick={() => navigate("/history-leave")}
            >
              ดูประวัติการลา
            </Button>
          </Box>
        </Box>
      </Container>

      {/* Footer */}
      <Box textAlign="center" py={3} bgcolor="#50B498" color="white">
        <Typography variant="body2">
          © 2025 ระบบจัดการการลา. สงวนลิขสิทธิ์.
        </Typography>
      </Box>
    </Box>
  );
};

export default HomePage;
