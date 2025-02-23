// src/components/LeaveRequests.jsx
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import NavBar from "../../components/NavBar";

const LeaveRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter state variables
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/leave-requests");
        const data = await response.json();
        if (response.ok) {
          setRequests(data);
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: data.error || "Failed to fetch leave requests.",
          });
        }
      } catch {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error occurred while fetching leave requests.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // Filter logic: combine free-text search with dropdown filters
  const filteredRequests = requests.filter((req) => {
    // Search query: check against username, leave type, or reason
    const searchMatch = searchQuery
      ? (req.user_name && req.user_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (req.type_name && req.type_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (req.reason && req.reason.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;

    const statusMatch = filterStatus
      ? req.status && req.status.toLowerCase() === filterStatus.toLowerCase()
      : true;

    const typeMatch = filterType
      ? req.type_name && req.type_name.toLowerCase().includes(filterType.toLowerCase())
      : true;

    const dateMatch = filterDate
      ? req.created_at && req.created_at.slice(0, 10) === filterDate
      : true;

    return searchMatch && statusMatch && typeMatch && dateMatch;
  });

  const clearFilters = () => {
    setSearchQuery("");
    setFilterStatus("");
    setFilterType("");
    setFilterDate("");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <div className="p-6">
        <h2 className="text-3xl font-bold mb-6 text-center">Leave Requests</h2>
        
        {/* Filter/Search Section */}
        <div className="bg-white p-4 rounded shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Search by name, type, or reason..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Leave Types</option>
              {/* You can dynamically generate these options based on available leave types */}
              <option value="Vacation">Vacation</option>
              <option value="Sick">Sick</option>
              <option value="Personal">Personal</option>
            </select>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={clearFilters}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors duration-200"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-center text-lg">Loading...</p>
        ) : filteredRequests.length === 0 ? (
          <p className="text-center text-lg">No leave requests found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow rounded">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-2 px-4 border-b">ID</th>
                  <th className="py-2 px-4 border-b">Username</th>
                  <th className="py-2 px-4 border-b">Leave Type</th>
                  <th className="py-2 px-4 border-b">Start Date</th>
                  <th className="py-2 px-4 border-b">End Date</th>
                  <th className="py-2 px-4 border-b">Reason</th>
                  <th className="py-2 px-4 border-b">Status</th>
                  <th className="py-2 px-4 border-b">Request Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((req) => (
                  <tr key={req.id} className="text-center hover:bg-gray-100">
                    <td className="py-2 px-4 border-b">{req.id}</td>
                    <td className="py-2 px-4 border-b">{req.user_name}</td>
                    <td className="py-2 px-4 border-b">{req.type_name || req.leave_type}</td>
                    <td className="py-2 px-4 border-b">{req.start_date}</td>
                    <td className="py-2 px-4 border-b">{req.end_date}</td>
                    <td className="py-2 px-4 border-b">{req.reason}</td>
                    <td className="py-2 px-4 border-b capitalize">{req.status}</td>
                    <td className="py-2 px-4 border-b">{req.created_at && req.created_at.slice(0, 10)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveRequests;
