import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./views/user/Login";
import Register from "./views/user/Register";
import HomePage from "./views/Homepage";
import HistoryLeave from "./views/leaveMangement/HistoryLeave";
import LeaveHistory from "./views/leaveMangement/LeaveHistory";
import HistoryConfirm from "./views/leaveMangement/HistoryConfirm";
import CreateLeaveRequest from "./views/leaveMangement/CreateLeaveRequest";
import TypeLeave from "./views/TypeLeave";
import UserProfile from "./views/user/UserProfile";
import StaticBoardLeave from "./views/StaticBoardLeave";
import ProtectedRoute from "./views/ProtectedRoute";
import UserManagement from "./views/user/UserManagement";

function App() {
  return (

        <div style={{ minHeight: "100vh", width: "100%", overflowX: "hidden" }}>
    <Router>
      <Routes>
        {/* Public Routes (No Navbar) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Pages (With Navbar) */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/history-leave" element={<HistoryLeave />} />
          <Route path="/create-leave-request" element={<CreateLeaveRequest />} />
          <Route path="/user-profile" element={<UserProfile />} />

          {/* Leader-only Routes */}
          <Route
            path="/leave-history"
            element={
              <ProtectedRoute allowedRoles={["leader", "manager"]}>
                <LeaveHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history-confirm"
            element={
              <ProtectedRoute allowedRoles={["leader", "manager"]}>
                <HistoryConfirm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/type-leave"
            element={
              <ProtectedRoute allowedRoles={["leader", "manager"]}>
                <TypeLeave />
              </ProtectedRoute>
            }
          />
          <Route
            path="/static-board-leave"
            element={
              <ProtectedRoute allowedRoles={["leader", "manager"]}>
                <StaticBoardLeave />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-management"
            element={
              <ProtectedRoute allowedRoles={["leader", "manager"]}>
                <UserManagement />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
    </div>
  );
}

export default App;
