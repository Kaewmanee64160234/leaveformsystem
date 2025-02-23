import "react";
import EmployeeNavBar from "../components/EmployeeNavBar";

const EmployeeHome = () => {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  return (
    <div className="min-h-screen bg-gray-100">
      <EmployeeNavBar />
      <main className="p-8">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">
            Welcome, {user ? user.name : "Employee"}!
          </h2>
          <p className="text-gray-700">
            Use the navigation above to apply for leave or view your leave history.
          </p>
        </div>
      </main>
    </div>
  );
};

export default EmployeeHome;
