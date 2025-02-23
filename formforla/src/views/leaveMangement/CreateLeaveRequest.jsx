import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import Swal from "sweetalert2";

const CreateLeaveRequest = () => {
  const [leaveType, setLeaveType] = useState('');
  const [leaveTypes, setLeaveTypes] = useState([]); // list of leave types
  const [managerId, setManagerId] = useState(''); // selected manager id
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [managers, setManagers] = useState([]);  // list of managers
  const navigate = useNavigate();

  // Fetch leave types on mount
  useEffect(() => {
    const fetchLeaveTypes = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/leave-types");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setLeaveTypes(data);
      } catch (err) {
        console.error("Error fetching leave types:", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error occurred while fetching leave types."
        });
      }
    };

    fetchLeaveTypes();
  }, []);

  // Fetch managers on mount
  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/users/managers");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setManagers(data);
      } catch (err) {
        console.error("Error fetching managers:", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error occurred while fetching managers."
        });
      }
    };

    fetchManagers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate dates
    if (new Date(startDate) > new Date(endDate)) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Start date must be before or equal to the end date."
      });
      return;
    }

    // Retrieve logged-in user
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    if (!user) {
      Swal.fire({
        icon: "error",
        title: "Not Authenticated",
        text: "Please log in first."
      });
      navigate("/login");
      return;
    }

    if (!managerId) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please select a manager."
      });
      return;
    }

    const payload = {
      user_id: user.id,
      manager_id: managerId,
      leave_type_id: leaveType,  // Adjust if needed: your backend might expect numeric IDs.
      startDate,
      endDate,
      reason
    };

    try {
      // log data
      console.log(payload);
      const response = await fetch("http://localhost:5000/api/leave-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      console.log(response);

      
      const data = await response.json();
      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Submitted",
          text: "Leave request submitted successfully!",
          timer: 2000,
          showConfirmButton: false
        });
        // Clear form and navigate
        setLeaveType('');
        setManagerId('');
        setStartDate('');
        setEndDate('');
        setReason('');
        navigate("/leave-history");
      } else {
        Swal.fire({
          icon: "error",
          title: "Submission Failed",
          text: data.error || "Unable to submit leave request."
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred. Please try again later."
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <NavBar />
      <div className="flex items-center justify-center mt-8">
        <form 
          onSubmit={handleSubmit} 
          className="bg-white p-6 rounded shadow-md w-full max-w-lg"
        >
          <h2 className="text-2xl font-bold mb-4 text-center">Apply for Leave</h2>
          
          <div className="mb-4">
            <label className="block text-gray-700">Leave Type</label>
            <select 
              value={leaveType} 
              onChange={(e) => setLeaveType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="">Select a leave type</option>
              {leaveTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.type_name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700">Manager</label>
            <select 
              value={managerId} 
              onChange={(e) => setManagerId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="">Select a manager</option>
              {managers.map((manager) => (
                <option key={manager.id} value={manager.id}>
                  {manager.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700">Start Date</label>
            <input 
              type="date" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required 
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700">End Date</label>
            <input 
              type="date" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required 
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700">Reason</label>
            <textarea 
              value={reason} 
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              rows="4"
              required
            ></textarea>
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
          >
            Submit Leave Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateLeaveRequest;
