// src/components/StaticBoardLeave.jsx
import "react";
import NavBar from "../components/NavBar";

const StaticBoardLeave = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <div className="container mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-center mb-6">
          Leave Statistics Board – Leader Only
        </h2>
        {/* Display charts, graphs, or summary statistics about leave usage */}
      </div>
    </div>
  );
};

export default StaticBoardLeave;
