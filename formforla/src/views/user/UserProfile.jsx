import { useState, useEffect } from "react";
import NavBar from "../../components/NavBar";
import Swal from "sweetalert2";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({ name: "", email: "", role: "" });

  // Load user from local storage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setUpdatedUser(parsedUser);
    }
  }, []);

  // Handle Input Change
  const handleChange = (e) => {
    setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
  };

  // Handle Profile Update
  const handleUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });
      const data = await response.json();

      if (response.ok) {
        Swal.fire({ icon: "success", title: "Profile Updated!" });
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser)); // Update local storage
        setEditing(false);
      } else {
        Swal.fire({ icon: "error", title: "Error", text: data.error || "Failed to update profile." });
      }
    } catch (error) {
      console.error("Update error:", error);
      Swal.fire({ icon: "error", title: "Error", text: "Something went wrong." });
    }
  };

  if (!user) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-6 mt-10">
        <h2 className="text-2xl font-bold text-center mb-4">User Profile</h2>
        <div className="flex flex-col items-center">
          <img src="https://as1.ftcdn.net/v2/jpg/05/16/27/58/1000_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg" alt="Profile" className="w-24 h-24 rounded-full shadow-lg mb-4" />
          <p className="text-gray-700"><strong>Role:</strong> {user.role}</p>
        </div>

        {/* Profile Details */}
        <div className="mt-6">
          <label className="block text-gray-600 font-semibold">Name</label>
          <input
            type="text"
            name="name"
            value={updatedUser.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            disabled={!editing}
          />

          <label className="block mt-4 text-gray-600 font-semibold">Email</label>
          <input
            type="email"
            name="email"
            value={updatedUser.email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            disabled={!editing}
          />
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-between">
          {editing ? (
            <>
              <button onClick={handleUpdate} className="bg-green-500 text-white px-4 py-2 rounded">Save</button>
              <button onClick={() => setEditing(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
            </>
          ) : (
            <button onClick={() => setEditing(true)} className="bg-blue-500 text-white px-4 py-2 rounded w-full">
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
