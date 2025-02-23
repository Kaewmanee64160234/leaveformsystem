const express = require("express");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

// Get list of managers from Users table (role = 'manager')
router.get("/managers", (req, res) => {
  const query = "SELECT id, name FROM Users WHERE role = ?";
  connection.query(query,['manager'], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    console.log("Managers:", results);
    
    res.json(results);
  });
});

// POST /register endpoint
router.post("/register", (req, res) => {
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

// POST /login endpoint
router.post("/login", (req, res) => {
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

// GET /user/:name endpoint
router.get("/user/:name", (req, res) => {
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
router.get("/profile/:userId", (req, res) => {
  const { userId } = req.params;

  const query = `
    SELECT id, name, email, role, leave_balance 
    FROM Users 
    WHERE id = ?
  `;

  connection.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching user profile:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(results[0]);
  });
});
router.put("/update-balance/:userId", (req, res) => {
  const { userId } = req.params;
  const { daysUsed } = req.body;

  console.log("Updating leave balance for user", userId, "with", daysUsed, "days used.");
  

  if (!daysUsed || daysUsed <= 0) {
    return res.status(400).json({ error: "Invalid leave days." });
  }

  const query = `
    UPDATE Users 
    SET leave_balance = leave_balance - ? 
    WHERE id = ? AND leave_balance >= ?;
  `;

  connection.query(query, [daysUsed, userId, daysUsed], (err, results) => {
    if (err) {
      console.error("Error updating leave balance:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.affectedRows === 0) {
      return res.status(400).json({ error: "Insufficient leave balance." });
    }


    res.json({ message: "Leave balance updated successfully." });
  });
});
module.exports = router;
