import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";

const StaticBoardLeave = () => {
  const [mostLeaveBalance, setMostLeaveBalance] = useState([]);
  const [leastLeaveBalance, setLeastLeaveBalance] = useState([]);
  const [mostUsedLeaveType, setMostUsedLeaveType] = useState([]);
  const [ setApprovalStats] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/employees/most-leave-balance")
      .then(res => res.json())
      .then(data => setMostLeaveBalance(data))
      .catch(err => console.error(err));

    fetch("http://localhost:5000/api/employees/least-leave-balance")
      .then(res => res.json())
      .then(data => setLeastLeaveBalance(data))
      .catch(err => console.error(err));

    fetch("http://localhost:5000/api/employees/most-used-leave-type")
      .then(res => res.json())
      .then(data => setMostUsedLeaveType(data))
      .catch(err => console.error(err));

    fetch("http://localhost:5000/api/employees/approval-status-count")
      .then(res => res.json())
      .then(data => setApprovalStats(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <div className="container mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-center mb-6">
          Leave Statistics Board
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* พนักงานที่มีวันลามากที่สุด */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-center mb-4">
              พนักงานที่มีวันลามากที่สุด (Top 5)
            </h3>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2">ชื่อ</th>
                  <th className="p-2 text-right">วันลา</th>
                </tr>
              </thead>
              <tbody>
                {mostLeaveBalance.map((emp, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">{emp.name}</td>
                    <td className="p-2 text-right">{emp.leave_balance} วัน</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* พนักงานที่เหลือวันลาน้อยที่สุด */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-center mb-4">
              พนักงานที่เหลือวันลาน้อยที่สุด (Top 5)
            </h3>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2">ชื่อ</th>
                  <th className="p-2 text-right">วันลา</th>
                </tr>
              </thead>
              <tbody>
                {leastLeaveBalance.map((emp, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">{emp.name}</td>
                    <td className="p-2 text-right">{emp.leave_balance} วัน</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ประเภทการลาที่ถูกใช้บ่อยที่สุด */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-center mb-4">
              ประเภทการลาที่ใช้บ่อยสุด (Top 5)
            </h3>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2">ประเภท</th>
                  <th className="p-2 text-right">จำนวนครั้ง</th>
                </tr>
              </thead>
              <tbody>
                {mostUsedLeaveType.map((type, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">{type.type_name}</td>
                    <td className="p-2 text-right">{type.count} ครั้ง</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaticBoardLeave;
