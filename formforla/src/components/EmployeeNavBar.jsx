// src/components/EmployeeNavBar.jsx
import "react";
import { Link, useNavigate } from "react-router-dom";

const EmployeeNavBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear stored token and user data on logout
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="flex justify-between items-center bg-white p-4 shadow">
      <div className="flex items-center space-x-4">
        <Link to="/employee-home" className="text-blue-500 font-bold">
          Dashboard
        </Link>
        <Link to="/leave-form" className="text-blue-500">
          Apply Leave
        </Link>
        <Link to="/leave-history" className="text-blue-500">
          Leave History
        </Link>
      </div>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
      >
        Logout
      </button>
    </nav>
  );
};

export default EmployeeNavBar;
