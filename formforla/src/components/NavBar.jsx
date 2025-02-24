import  { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const NavBar = () => {
  const navigate = useNavigate();
  useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  // Get logged-in user (default to "employee" role)
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : { role: "employee" };

  // Menu items for all users
  const baseMenu = [
    { path: "/", label: "Home" },
    { path: "/create-leave-request", label: "ใบขอการลา" },
    { path: "/history-leave", label: "ประวัติการลา" },
    { path: "/user-profile", label: "ข้อมูลส่วนตัว" },
  ];

  // Additional menu items for Leaders/Managers
  const leaderMenu = [
    { path: "/leave-history", label: "คำร้องการลา" },
    { path: "/history-confirm", label: "ประวัติยืนยันการลา" },
    { path: "/type-leave", label: "ประเภทการลา" },
    { path: "/static-board-leave", label: "สถิติการลา" },
    { path: "/user-management", label: "จัดการผู้ใช้งาน" },
  ];

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      {/* Top AppBar */}
      <AppBar position="sticky" sx={{ background: "linear-gradient(to right, #1976d2, #1e88e5)" }}>
        <Toolbar>
          {/* Mobile Menu Button */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => setMenuOpen(true)}
            sx={{ mr: 2, display: { xs: "block", md: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Title */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Leave Management
          </Typography>

          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
            {baseMenu.map((item) => (
              <Button key={item.path} component={Link} to={item.path} color="inherit">
                {item.label}
              </Button>
            ))}
            {(user.role === "leader" || user.role === "manager") &&
              leaderMenu.map((item) => (
                <Button key={item.path} component={Link} to={item.path} color="inherit">
                  {item.label}
                </Button>
              ))}
          </Box>

          {/* User Menu */}
          <IconButton color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)}>
            <AccountCircleIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem onClick={() => navigate("/user-profile")}>Profile</MenuItem>
            <MenuItem onClick={handleLogout}>
              <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer (Mobile Navigation) */}
      <Drawer anchor="left" open={menuOpen} onClose={() => setMenuOpen(false)}>
        <Box sx={{ width: 250 }}>
          <List>
            {baseMenu.map((item) => (
              <ListItem button key={item.path} onClick={() => navigate(item.path)}>
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
            {(user.role === "leader" || user.role === "manager") && (
              <>
                <Divider />
                {leaderMenu.map((item) => (
                  <ListItem button key={item.path} onClick={() => navigate(item.path)}>
                    <ListItemText primary={item.label} />
                  </ListItem>
                ))}
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default NavBar;
