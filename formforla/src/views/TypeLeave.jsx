// src/components/CreateLeaveType.jsx
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import NavBar from "../components/NavBar";

const CreateLeaveType = () => {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [typeName, setTypeName] = useState("");
  const [description, setDescription] = useState("");

  // Fetch list of leave types
  const fetchLeaveTypes = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/leave-types");
      const data = await response.json();
      if (response.ok) {
        setLeaveTypes(data);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.error || "Failed to fetch leave types.",
        });
      }
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while fetching leave types.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveTypes();
  }, []);

  // Handle modal form submission
  const handleModalSubmit = async (e) => {
    e.preventDefault();

    if (!typeName.trim()) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Leave type name is required.",
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/leave-types", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type_name: typeName, description }),
      });
      const data = await response.json();
      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Leave type created successfully.",
          timer: 2000,
          showConfirmButton: false,
        });
        // Clear fields and close modal
        setTypeName("");
        setDescription("");
        setModalOpen(false);
        // Refresh the list
        fetchLeaveTypes();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.error || "Creation failed.",
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while creating the leave type.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <div className="container mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-center mb-6">Manage Leave Types</h2>
        
        {/* Button to open the modal */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setModalOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add Leave Type
          </button>
        </div>

        {/* List of leave types */}
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : leaveTypes.length === 0 ? (
          <p className="text-center">No leave types found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow rounded">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-2 px-4 border-b">ID</th>
                  <th className="py-2 px-4 border-b">Leave Type Name</th>
                  <th className="py-2 px-4 border-b">Description</th>
                  <th className="py-2 px-4 border-b">Created At</th>
                </tr>
              </thead>
              <tbody>
                {leaveTypes.map((lt) => (
                  <tr key={lt.id} className="text-center hover:bg-gray-100">
                    <td className="py-2 px-4 border-b">{lt.id}</td>
                    <td className="py-2 px-4 border-b">{lt.type_name}</td>
                    <td className="py-2 px-4 border-b">{lt.description}</td>
                    <td className="py-2 px-4 border-b">
                      {lt.created_at && lt.created_at.slice(0, 10)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal for creating a new leave type */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">Add New Leave Type</h3>
            <form onSubmit={handleModalSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Leave Type Name</label>
                <input
                  type="text"
                  value={typeName}
                  onChange={(e) => setTypeName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                ></textarea>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateLeaveType;
