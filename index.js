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

// find user by name
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


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
