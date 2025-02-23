const express = require("express");
const mysql = require("mysql");

const router = express.Router();

// MySQL connection configuration
const connection = mysql.createConnection({
  host: "localhost",    // XAMPP MySQL server host
  user: "root",         // default XAMPP username
  password: "",         // default XAMPP password (usually empty)
  database: "formleav"  // your database name
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to the MySQL database.");
});

// GET  endpoint
router.get('/', (req, res) => {
  // Base query to join LeaveRequests with Users and LeaveTypes
  let query = `
    SELECT 
      lr.id, 
      lr.user_id, 
      u.name AS user_name, 
      lr.leave_type_id, 
      lt.type_name, 
      lr.start_date, 
      lr.end_date, 
      lr.reason, 
      lr.status, 
      lr.created_at
    FROM LeaveRequests lr
    LEFT JOIN Users u ON lr.user_id = u.id
    LEFT JOIN LeaveTypes lt ON lr.leave_type_id = lt.id
  `;
  
  // Collect filter conditions and parameters
  const { status, leaveType } = req.query;
  const conditions = [];
  const params = [];
  
  if (status) {
    conditions.push("lr.status = ?");
    params.push(status);
  }
  
  if (leaveType) {
    // Filter by leave type name. If you prefer filtering by leave_type_id, adjust accordingly.
    conditions.push("lt.type_name = ?");
    params.push(leaveType);
  }
  
  // Add WHERE clause if any conditions exist
  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }
  
  // Order results by creation date descending
  query += " ORDER BY lr.created_at DESC";
  
  // Execute the query
  connection.query(query, params, (err, results) => {
    if (err) {
      console.error("Error fetching leave requests:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

// GET /:userId endpoint
router.get('/:userId', (req, res) => {
  const userId = req.params.userId;
  connection.query("SELECT * FROM LeaveRequests WHERE user_id = ?", [userId], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

// POST  endpoint
router.post("/", (req, res) => {
  const { user_id, leave_type_id, start_date, end_date, reason, status } = req.body;
  if (!user_id || !leave_type_id || !start_date || !end_date || !reason) {
    return res.status(400).json({ error: "Missing required fields." });
  }
  // Default status to 'pending' if not provided.
  const requestStatus = status || "pending";
  connection.query(
    "INSERT INTO LeaveRequests (user_id, leave_type_id, start_date, end_date, reason, status) VALUES (?, ?, ?, ?, ?, ?)",
    [user_id, leave_type_id, start_date, end_date, reason, requestStatus],
    (err, results) => {
      if (err) {
        console.error("Error inserting leave request:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.status(201).json({ message: "Leave request created", id: results.insertId });
    }
  );
});

// GET /:id endpoint
router.get("/:id", (req, res) => {
  const { id } = req.params;
  connection.query("SELECT * FROM LeaveRequests WHERE id = ?", [id], (err, results) => {
    if (err) {
      console.error("Error fetching leave request:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Leave request not found" });
    }
    res.json(results[0]);
  });
});

// PUT /:id endpoint
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { user_id, leave_type_id, start_date, end_date, reason, status } = req.body;
  connection.query(
    "UPDATE LeaveRequests SET user_id = ?, leave_type_id = ?, start_date = ?, end_date = ?, reason = ?, status = ? WHERE id = ?",
    [user_id, leave_type_id, start_date, end_date, reason, status, id],
    (err, results) => {
      if (err) {
        console.error("Error updating leave request:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json({ message: "Leave request updated" });
    }
  );
});

// DELETE /:id endpoint
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  connection.query("DELETE FROM LeaveRequests WHERE id = ?", [id], (err, results) => {
    if (err) {
      console.error("Error deleting leave request:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ message: "Leave request deleted" });
  });
});

module.exports = router;
