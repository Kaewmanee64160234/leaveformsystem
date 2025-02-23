// index.js

const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 5000;

// MySQL connection configuration
const connection = mysql.createConnection({
  host: "localhost",    // XAMPP MySQL server host
  user: "root",         // default XAMPP username
  password: "",         // default XAMPP password (usually empty)
  database: "formleav"    // your database name
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to the MySQL database.");
});

// Middleware
app.use(express.json());
app.use(cors());

// POST /register endpoint
app.post("/register", (req, res) => {
  const { name, email, password, role } = req.body;

  // Validate required fields
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: "Please provide all required fields." });
  }

  // Check if the user already exists
  connection.query("SELECT * FROM Users WHERE email = ? OR name = ?", [email, name], async (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (results.length > 0) {
      return res.status(400).json({ error: "User with this email or name already exists." });
    }

    // Hash the password
    try {
      const password_hash = await bcrypt.hash(password, 10);
      // Insert the new user into the database
      connection.query(
        "INSERT INTO Users (name, email, password_hash, role) VALUES (?, ?, ?, ?)",
        [name, email, password_hash, role],
        (err, result) => {
          if (err) {
            console.error("Error inserting user:", err);
            return res.status(500).json({ error: "Database error" });
          }
          res.status(201).json({ message: "User registered successfully" });
        }
      );
    } catch (error) {
      console.error("Error hashing password:", error);
      return res.status(500).json({ error: "Server error" });
    }
  });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  
  connection.query("SELECT * FROM Users WHERE email = ?", [email], async (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    
    const user = results[0];
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    
    // Generate JWT (adjust secret and expiration as needed)
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      "YOUR_SECRET_KEY", 
      { expiresIn: "1h" }
    );
    
    res.json({ token, user });
  });
});

app.get("/user/:name", (req, res) => {
  const name = req.params.name;
  connection.query("SELECT * FROM Users WHERE name = ?", [name], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(results[0]);
  });
});

// In your index.js (or a dedicated routes file)

app.get('/leave-requests', (req, res) => {
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

// get all leave by user
app.get('/leave-requests/:userId', (req, res) => {
  const userId = req.params.userId;
  connection.query("SELECT * FROM LeaveRequests WHERE user_id = ?", [userId], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
