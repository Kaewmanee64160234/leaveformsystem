import { useEffect, useState } from "react";
import NavBar from "../../components/NavBar";

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, [search]);

  const fetchUsers = () => {
    fetch(`http://localhost:5000/api/users?search=${search}`)
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error(err));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <div className="container mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-center mb-6">
          User Management
        </h2>

        {/* Search Input */}
        <div className="mb-6 flex justify-center">
          <input
            type="text"
            placeholder="🔍 ค้นหาด้วยชื่อหรืออีเมล..."
            className="w-1/2 p-3 border rounded-lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* User Table */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3">ID</th>
                <th className="p-3">ชื่อ</th>
                <th className="p-3">อีเมล</th>
                <th className="p-3">บทบาท</th>
                <th className="p-3 text-right">วันลาคงเหลือ</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-100">
                    <td className="p-3">{user.id}</td>
                    <td className="p-3">{user.name}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">{user.role === "employee" ? "พนักงาน" : "ผู้จัดการ"}</td>
                    <td className="p-3 text-right">{user.leave_balance} วัน</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-3 text-center">
                    ไม่พบข้อมูล
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
