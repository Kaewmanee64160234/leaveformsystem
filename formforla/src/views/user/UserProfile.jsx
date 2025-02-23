// src/components/UserProfile.jsx
import "react";
import NavBar from "../../components/NavBar";

const UserProfile = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <div className="container mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-center mb-6">User Profile</h2>
        {/* Display user details and profile update options */}
      </div>
    </div>
  );
};

export default UserProfile;
