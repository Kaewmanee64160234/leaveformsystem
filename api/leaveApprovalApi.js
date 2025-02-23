const express = require("express");
const mysql = require("mysql");

const router = express.Router();

// MySQL connection configuration
const connection = mysql.createConnection({
  host: "localhost",    // XAMPP MySQL server host
  user: "root",         // default XAMPP username
  password: "",         // default XAMPP password (usually empty)
  database: "leaveapprovals"  // your database name
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to the MySQL database.");
});

// POST / endpoint
router.post("/", (req, res) => {
  const { leave_request_id, manager_id, approval_status, comment } = req.body;
  if (!leave_request_id || !manager_id || !approval_status) {
    return res.status(400).json({ error: "Missing required fields." });
  }
  connection.query(
    "INSERT INTO LeaveApprovals (leave_request_id, manager_id, approval_status, comment) VALUES (?, ?, ?, ?)",
    [leave_request_id, manager_id, approval_status, comment],
    (err, results) => {
      if (err) {
        console.error("Error inserting leave approval:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.status(201).json({ message: "Leave approval created", id: results.insertId });
    }
  );
});

// GET / endpoint
router.get("/", (req, res) => {
  connection.query("SELECT * FROM LeaveApprovals", (err, results) => {
    if (err) {
      console.error("Error fetching leave approvals:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

// GET //:id endpoint
router.get("/:id", (req, res) => {
  const { id } = req.params;
  connection.query("SELECT * FROM LeaveApprovals WHERE id = ?", [id], (err, results) => {
    if (err) {
      console.error("Error fetching leave approval:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Leave approval not found" });
    }
    res.json(results[0]);
  });
});

// PUT //:id endpoint
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { leave_request_id, manager_id, approval_status, comment } = req.body;
  connection.query(
    "UPDATE LeaveApprovals SET leave_request_id = ?, manager_id = ?, approval_status = ?, comment = ? WHERE id = ?",
    [leave_request_id, manager_id, approval_status, comment, id],
    (err, results) => {
      if (err) {
        console.error("Error updating leave approval:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json({ message: "Leave approval updated" });
    }
  );
});

// DELETE //:id endpoint
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  connection.query("DELETE FROM LeaveApprovals WHERE id = ?", [id], (err, results) => {
    if (err) {
      console.error("Error deleting leave approval:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ message: "Leave approval deleted" });
  });
});

module.exports = router;
