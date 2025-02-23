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

// GET  endpoint
router.get("/", (req, res) => {
  // Base query joining LeaveRequests with Users and LeaveTypes
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
      lr.created_at,
      lr.manager_id
    FROM LeaveRequests lr
    LEFT JOIN Users u ON lr.user_id = u.id
    LEFT JOIN LeaveTypes lt ON lr.leave_type_id = lt.id
  `;
  
  // Build filtering conditions from query parameters
  const { status, leaveType, user_id, manager_id } = req.query;
  const conditions = [];
  const params = [];
  
  if (status) {
    conditions.push("lr.status = ?");
    params.push(status);
  }
  
  if (leaveType) {
    conditions.push("lt.type_name = ?");
    params.push(leaveType);
  }
  
  if (user_id) {
    conditions.push("lr.user_id = ?");
    params.push(user_id);
  }
  
  if (manager_id) {
    conditions.push("lr.manager_id = ?");
    params.push(manager_id);
  }
  
  // Append the WHERE clause if conditions exist
  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }
  
  // Order by created_at descending
  query += " ORDER BY lr.created_at DESC";
  
  // Execute the query
  connection.query(query, params, (err, results) => {
    if (err) {
      console.error("Error fetching leave requests:", err);
      return res.status(500).json({ error: "Database error" });
    }
    
    // Map each result to include leave type, start date, end date, reason, and status
    const filteredResults = results.map((r) => ({
      id: r.id,
      leaveType: r.type_name,
      startDate: r.start_date,
      endDate: r.end_date,
      reason: r.reason,
      status: r.status,
      user_name: r.user_name,
    }));
    console.log("filteredResults", filteredResults);
    
    res.json(filteredResults);
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
    console.log("req.body", req.body);
    
    const { user_id, manager_id, leave_type_id, startDate, endDate, reason, status } = req.body;
    
    // Check for required fields
    if (!user_id || !manager_id || !leave_type_id || !startDate || !endDate || !reason) {
      return res.status(400).json({ error: "Missing required fields." });
    }
    
    // Default status to 'pending' if not provided
    const requestStatus = status || "pending";
    
    // Insert the leave request including the manager_id
    connection.query(
      "INSERT INTO LeaveRequests (user_id, manager_id, leave_type_id, start_date, end_date, reason, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [user_id, manager_id, leave_type_id, startDate, endDate, reason, requestStatus],
      (err, results) => {
        //  log qiery error
        console.log(
            "INSERT INTO LeaveRequests (user_id, manager_id, leave_type_id, start_date, end_date, reason, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [user_id, manager_id, leave_type_id,startDate, endDate, reason, requestStatus]
        );
        
        if (err) {
            console.log("Error inserting leave request:", err);
            
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
  console.log("req.body", req.body);
  console.log("req.params", req.params);
  
  
  // If the request body contains only the "status" property, update only the status.
  if (Object.keys(req.body).length === 1 && req.body.status) {
    connection.query(
      "UPDATE LeaveRequests SET status = ? WHERE id = ?",
      [req.body.status, id],
      (err, results) => {
        if (err) {
          console.error("Error updating leave request status:", err);
          return res.status(500).json({ error: "Database error" });
        }
        console.log("UPDATE LeaveRequests SET status = ? WHERE id = ?", [req.body.status, id]);
        res.json({ message: "Leave request status updated" });
      }
    );
  } else {
    // Otherwise, update all fields (if needed)
    const { user_id, leave_type_id, start_date, end_date, reason, status } = req.body;
    connection.query(
      "UPDATE LeaveRequests SET user_id = ?, leave_type_id = ?, start_date = ?, end_date = ?, reason = ?, status = ? WHERE id = ?",
      [user_id, leave_type_id, start_date, end_date, reason, status, id],
      (err, results) => {
        if (err) {
          console.error("Error updating leave request:", err);
          return res.status(500).json({ error: "Database error" });
        }
        console.log(
          "UPDATE LeaveRequests SET user_id = ?, leave_type_id = ?, start_date = ?, end_date = ?, reason = ?, status = ? WHERE id = ?",
          [user_id, leave_type_id, start_date, end_date, reason, status, id]
        );
        res.json({ message: "Leave request updated" });
      }
    );
  }
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
