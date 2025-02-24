import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from "@mui/icons-material/Home";
import AssignmentIcon from "@mui/icons-material/Assignment";
import HistoryIcon from "@mui/icons-material/History";
import CategoryIcon from "@mui/icons-material/Category";
import PieChartIcon from "@mui/icons-material/PieChart";
import PeopleIcon from "@mui/icons-material/People";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DescriptionIcon from "@mui/icons-material/Description";

const NavBar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // Get logged-in user (default to "employee" role)
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : { role: "employee" };

  // Menu items for all users
  const baseMenu = [
    { path: "/", label: "Home", icon: <HomeIcon /> },
    { path: "/create-leave-request", label: "ใบขอการลา", icon: <AssignmentIcon /> },
    { path: "/history-leave", label: "ประวัติการลา", icon: <HistoryIcon /> },
    { path: "/user-profile", label: "ข้อมูลส่วนตัว", icon: <AccountCircleIcon /> },
  ];

  // Additional menu items for Leaders/Managers
  const leaderMenu = [
    { path: "/leave-history", label: "คำร้องการลา", icon: <DescriptionIcon /> },
    { path: "/history-confirm", label: "ประวัติยืนยันการลา", icon: <CheckCircleIcon /> },
    { path: "/type-leave", label: "ประเภทการลา", icon: <CategoryIcon /> },
    { path: "/static-board-leave", label: "สถิติการลา", icon: <PieChartIcon /> },
    { path: "/user-management", label: "จัดการผู้ใช้งาน", icon: <PeopleIcon /> },
  ];

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    window.location.reload();

  };

  return (
    <>
      {/* ✅ Top AppBar */}
      <AppBar position="sticky" sx={{ background: "#50B498" }}>
        <Toolbar>
          {/* 📱 Menu Button for Opening Drawer */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => setMenuOpen(true)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          {/* 📌 Title */}
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
            Leave Management
          </Typography>

          {/* 👤 User Menu */}
          <IconButton color="inherit" onClick={() => navigate("/user-profile")}>
            <AccountCircleIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* 📱 Full-Screen Drawer (Used on All Screen Sizes) */}
      <Drawer
        anchor="left"
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        sx={{ width: "100%", maxWidth: "100vw" }}
        PaperProps={{
          sx: {
            width: "100%",
            maxWidth: 300, // Adjust width of the drawer
            height: "100%",
            background: "#50B498",
            color: "white",
          },
        }}
      >
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
          {/* 🔘 Close Button */}
          <Box display="flex" justifyContent="flex-end" p={2}>
            <IconButton onClick={() => setMenuOpen(false)} sx={{ color: "white" }}>
              <CloseIcon />
            </IconButton>
          </Box>

          <List>
            {baseMenu.map((item) => (
              <ListItem button key={item.path} onClick={() => navigate(item.path)}>
                <IconButton sx={{ color: "white", mr: 1 }}>{item.icon}</IconButton>
                <ListItemText primary={item.label} />
              </ListItem>
            ))}

            {(user.role === "leader" || user.role === "manager") && (
              <>
                <Divider sx={{ bgcolor: "white", my: 2 }} />
                {leaderMenu.map((item) => (
                  <ListItem button key={item.path} onClick={() => navigate(item.path)}>
                    <IconButton sx={{ color: "white", mr: 1 }}>{item.icon}</IconButton>
                    <ListItemText primary={item.label} />
                  </ListItem>
                ))}
              </>
            )}
          </List>

          {/* 🔴 Logout Button at Bottom */}
          <Box sx={{ p: 2, textAlign: "center", mt: "auto" }}>
            <Button
              onClick={handleLogout}
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: "red",
                color: "white",
                "&:hover": { backgroundColor: "#d32f2f" },
              }}
            >
              <LogoutIcon sx={{ mr: 1 }} /> Logout
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default NavBar;
