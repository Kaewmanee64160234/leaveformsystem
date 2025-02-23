// src/components/EmployeeHome.jsx
import 'react';
import { Link } from 'react-router-dom';

const EmployeeHome = () => {
  // Retrieve user data from localStorage
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="flex justify-between items-center bg-white p-4 shadow">
        <h1 className="text-2xl font-bold">Employee Dashboard</h1>
        <nav>
          <Link to="/leave-form" className="mr-4 text-blue-500">Apply Leave</Link>
          <Link to="/leave-history" className="text-blue-500">Leave History</Link>
        </nav>
      </header>
      <main className="p-8">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">  Welcome, {user ? user.name : "Employee"}!</h2>
          <p className="text-gray-700">
            Use the navigation above to apply for leave or view your leave history.
          </p>
        </div>
      </main>
    </div>
  );
};

export default EmployeeHome;
