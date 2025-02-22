// index.js

const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Create the MySQL connection using XAMPP defaults
const connection = mysql.createConnection({
  host: 'localhost',    // XAMPP's MySQL server host
  user: 'root',         // default XAMPP username
  password: '',         // default XAMPP password (usually empty)
  database: 'testdb'    // replace with your database name
});

// Connect to the MySQL database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to the MySQL database via XAMPP.');
});

// A sample route to query the database
app.get('/users', (req, res) => {
  connection.query('SELECT * FROM users', (error, results) => {
    if (error) {
      console.error('Error fetching data from MySQL:', error);
      return res.status(500).json({ error: 'Database query error' });
    }
    res.json(results);
  });
});

// A basic route for testing the server
app.get('/', (req, res) => {
  res.send('Hello from Express connected to MySQL via XAMPP!');
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
