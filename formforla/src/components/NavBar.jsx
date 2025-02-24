// src/components/NavBar.jsx
import "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Get logged in user and role (default to "employee" if none)
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : { role: "employee" };

  // Helper function to determine active link styling
  const linkClass = (path) =>
    pathname === path ? "text-yellow-300 font-bold" : "text-white hover:text-gray-200";

  // Define base menu items (accessible by everyone)
  const baseMenu = [
    { path: "/", label: "Home" },
    { path: "/create-leave-request", label: "ใบขอการลา" },
    { path: "/history-leave", label: "ประวัติการลา" },
    { path: "/user-profile", label: "ข้อมูลส่วนตัว" }
  ];

  // Define additional items for Leaders/Managers
  const leaderMenu = [
    { path: "/leave-history", label: "คำร้องการลา" },
    { path: "/history-confirm", label: "ประวัติยืนยันการลา" },
    { path: "/type-leave", label: "ประเภทการลา" },
    { path: "/static-board-leave", label: "สถิติการลา" },
    // user management
    {path: "/user-management", label: "จัดการผู้ใช้งาน"}
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="bg-gradient-to-r from-blue-500 to-blue-700 shadow-lg">
      <div className="container mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center">
        <h1 className="text-white text-3xl font-bold mb-2 md:mb-0">
          Leave Management
        </h1>
        <nav>
          <ul className="flex space-x-4">
            {baseMenu.map((item) => (
              <li key={item.path}>
                <Link to={item.path} className={linkClass(item.path)}>
                  {item.label}
                </Link>
              </li>
            ))}
            {/* Conditionally render leader-only menu items */}
            {(user.role === "leader" || user.role === "manager") &&
              leaderMenu.map((item) => (
                <li key={item.path}>
                  <Link to={item.path} className={linkClass(item.path)}>
                    {item.label}
                  </Link>
                </li>
              ))}
          </ul>
        </nav>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded mt-2 md:mt-0"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default NavBar;
