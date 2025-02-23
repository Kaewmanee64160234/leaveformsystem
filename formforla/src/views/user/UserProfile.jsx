import { useState, useEffect } from "react";
import NavBar from "../../components/NavBar";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const userData = storedUser ? JSON.parse(storedUser) : null;
        
        if (!userData) {
          alert("Please log in first.");
          return;
        }

        const response = await fetch(`http://localhost:5000/api/users/profile/${userData.id}`);
        const data = await response.json();

        if (response.ok) {
          setUser(data);
        } else {
          alert(data.error || "Failed to fetch user profile.");
        }
      } catch (err) {
        console.error(err);
        alert("An error occurred while fetching user profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-center">User Profile</h2>

          {loading ? (
            <p className="text-center">Loading...</p>
          ) : user ? (
            <div>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> {user.role}</p>
              <p className="text-lg font-bold mt-4">
                🏖️ <strong>Leave Balance:</strong> {user.leave_balance} days
              </p>
            </div>
          ) : (
            <p className="text-center text-red-500">User not found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
