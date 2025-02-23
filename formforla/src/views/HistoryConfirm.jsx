// src/components/HistoryConfirm.jsx
import "react";
import NavBar from "../components/NavBar";

const HistoryConfirm = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <div className="container mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-center mb-6">
          History Confirm (หัวหน้า confirm ใครไปบ้าน) – Leader Only
        </h2>
        {/* Add your confirmed leave requests UI here */}
      </div>
    </div>
  );
};

export default HistoryConfirm;
