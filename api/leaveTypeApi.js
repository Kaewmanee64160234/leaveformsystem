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

// POST  endpoint
router.post("/", (req, res) => {
  const { type_name, description } = req.body;
  if (!type_name) {
    return res.status(400).json({ error: "Leave type name is required." });
  }
  connection.query(
    "INSERT INTO LeaveTypes (type_name, description) VALUES (?, ?)",
    [type_name, description],
    (err, results) => {
      if (err) {
        console.error("Error inserting leave type:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.status(201).json({ message: "Leave type created", id: results.insertId });
    }
  );
});

// GET  endpoint
router.get("/", (req, res) => {
  connection.query("SELECT * FROM LeaveTypes", (err, results) => {
    if (err) {
      console.error("Error fetching leave types:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

// GET /:id endpoint
router.get("/:id", (req, res) => {
  const { id } = req.params;
  connection.query("SELECT * FROM LeaveTypes WHERE id = ?", [id], (err, results) => {
    if (err) {
      console.error("Error fetching leave type:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Leave type not found" });
    }
    res.json(results[0]);
  });
});

// PUT /:id endpoint
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { type_name, description } = req.body;
  connection.query(
    "UPDATE LeaveTypes SET type_name = ?, description = ? WHERE id = ?",
    [type_name, description, id],
    (err, results) => {
      if (err) {
        console.error("Error updating leave type:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json({ message: "Leave type updated" });
    }
  );
});

// DELETE /:id endpoint
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  connection.query("DELETE FROM LeaveTypes WHERE id = ?", [id], (err, results) => {
    if (err) {
      console.error("Error deleting leave type:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ message: "Leave type deleted" });
  });
});

module.exports = router;
