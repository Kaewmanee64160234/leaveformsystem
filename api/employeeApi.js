const express = require("express");
const mysql = require("mysql");

const router = express.Router();

// ตั้งค่า MySQL connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "leaveapprovals",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL Database.");
});

// 1️⃣ พนักงานที่มีวันลามากที่สุด (Top 5)
router.get("/most-leave-balance", (req, res) => {
  const sql = `
    SELECT id, name, leave_balance 
    FROM users 
    ORDER BY leave_balance DESC 
    LIMIT 5
  `;
  connection.query(sql, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// 2️⃣ พนักงานที่เหลือวันลาน้อยที่สุด (Top 5)
router.get("/least-leave-balance", (req, res) => {
  const sql = `
    SELECT id, name, leave_balance 
    FROM users 
    ORDER BY leave_balance ASC 
    LIMIT 5
  `;
  connection.query(sql, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// 3️⃣ ประเภทการลาที่ถูกใช้บ่อยที่สุด (Top 5)
router.get("/most-used-leave-type", (req, res) => {
  const sql = `
    SELECT lt.type_name, COUNT(lr.id) AS count 
    FROM leaverequests lr 
    JOIN leavetypes lt ON lr.leave_type_id = lt.id 
    GROUP BY lt.type_name 
    ORDER BY count DESC 
    LIMIT 5
  `;
  connection.query(sql, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// 4️⃣ จำนวนคำขอที่อนุมัติและถูกปฏิเสธ
router.get("/approval-status-count", (req, res) => {
  const sql = `
    SELECT approval_status, COUNT(id) AS count 
    FROM leaveapprovals 
    GROUP BY approval_status
  `;
  connection.query(sql, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

module.exports = router;
