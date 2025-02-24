import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  return (
    <div style={{ minHeight: "100vh", width: "100%", overflowX: "hidden" }}>
      <Router>
        <Routes>
          {/* 🔐 Public Routes (Login & Register) */}
          {!user ? (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </>
          ) : (
            <>
              {/* 🔄 Redirect logged-in users away from login/register */}
              <Route path="/login" element={<Navigate to="/" replace />} />
              <Route path="/register" element={<Navigate to="/" replace />} />
            </>
          )}

          {/* 🔒 Protected Pages (Require Login) */}
          {user ? (
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/history-leave" element={<HistoryLeave />} />
              <Route path="/create-leave-request" element={<CreateLeaveRequest />} />
              <Route path="/user-profile" element={<UserProfile />} />

              {/* 👥 Leader/Manager-Only Routes */}
              <Route element={<ProtectedRoute allowedRoles={["leader", "manager"]} />}>
                <Route path="/leave-history" element={<LeaveHistory />} />
                <Route path="/history-confirm" element={<HistoryConfirm />} />
                <Route path="/type-leave" element={<TypeLeave />} />
                <Route path="/static-board-leave" element={<StaticBoardLeave />} />
                <Route path="/user-management" element={<UserManagement />} />
              </Route>
            </Route>
          ) : (
            <Route path="*" element={<Navigate to="/login" replace />} />
          )}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
