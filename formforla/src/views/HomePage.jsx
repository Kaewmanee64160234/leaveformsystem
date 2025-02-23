// src/components/HomePage.jsx
import "react";
import NavBar from "../components/NavBar";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-center text-blue-700">
          Welcome to the Leave Management System
        </h1>
      </div>
    </div>
  );
};

export default HomePage;
