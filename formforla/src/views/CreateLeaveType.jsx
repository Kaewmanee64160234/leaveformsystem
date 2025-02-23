// src/components/CreateLeaveType.jsx
import { useState } from "react";
import Swal from "sweetalert2";

const CreateLeaveType = () => {
  const [typeName, setTypeName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
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
      const response = await fetch("http://localhost:5000/leave-types", {
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
        // Optionally clear the form or navigate elsewhere
        setTypeName("");
        setDescription("");
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          Create Leave Type
        </h2>
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
            rows="4"
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded font-semibold transition-colors duration-200"
        >
          Create Leave Type
        </button>
      </form>
    </div>
  );
};

export default CreateLeaveType;
