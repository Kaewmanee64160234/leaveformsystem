const express = require("express");
const mysql = require("mysql");

const router = express.Router();

// MySQL connection configuration
const connection = mysql.createConnection({
  host: "localhost", // XAMPP MySQL server host
  user: "root", // default XAMPP username
  password: "", // default XAMPP password (usually empty)
  database: "leaveapprovals", // your database name
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to the MySQL database.");
});

// Calculate total leave days
const calculateLeaveDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1; // Includes both days
};

// ✅ Get all leave requests with filters
router.get("/", (req, res) => {
  let query = `
    SELECT 
      lr.id, 
      lr.user_id, 
      u.name AS user_name, 
      lr.leave_type_id, 
      lt.type_name AS leaveType, 
      lr.start_date as startDate, 
      lr.end_date as endDate, 
      lr.reason, 
      lr.status, 
      lr.manager_id, 
      u.leave_balance  -- ✅ Fetch user's leave balance
    FROM LeaveRequests lr
    LEFT JOIN Users u ON lr.user_id = u.id
    LEFT JOIN LeaveTypes lt ON lr.leave_type_id = lt.id
  `;

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
    // ✅ Ensure manager can see their own leave requests
    conditions.push("(lr.manager_id = ? OR lr.user_id = ?)");
    params.push(manager_id, manager_id);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  query += " ORDER BY lr.created_at DESC";

  connection.query(query, params, (err, results) => {
    if (err) {
      console.error("Error fetching leave requests:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json(results);
  });
});

// ✅ Get leave history for a specific user
router.get("/user/:id", (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT 
      lr.id, 
      lt.type_name AS leaveType, 
      lr.start_date, 
      lr.end_date, 
      lr.reason, 
      lr.status,
      lr.manager_id,
      u.name AS approved_by,
      u.leave_balance,
      u.id AS user_id
    FROM LeaveRequests lr
    LEFT JOIN LeaveTypes lt ON lr.leave_type_id = lt.id
    LEFT JOIN Users u ON lr.manager_id = u.id
    WHERE lr.user_id = ?
    ORDER BY lr.start_date DESC
  `;

  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json(results);
  });
});

// ✅ Create a new leave request
router.post("/", (req, res) => {
  const {
    user_id,
    manager_id,
    leave_type_id,
    startDate,
    endDate,
    reason,
    status,
  } = req.body;

  if (
    !user_id ||
    !manager_id ||
    !leave_type_id ||
    !startDate ||
    !endDate ||
    !reason
  ) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const totalDays = calculateLeaveDays(startDate, endDate);

  // Check if the user has enough leave balance
  connection.query(
    "SELECT leave_balance FROM Users WHERE id = ?",
    [user_id],
    (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Database error" });
      }

      const availableBalance = results[0].leave_balance;
      if (availableBalance < totalDays) {
        return res
          .status(400)
          .json({
            error: `Insufficient leave balance. You have ${availableBalance} days left.`,
          });
      }

      connection.query(
        "INSERT INTO LeaveRequests (user_id, manager_id, leave_type_id, start_date, end_date, reason, status) VALUES (?, ?, ?, ?, ?, ?, 'pending')",
        [user_id, manager_id, leave_type_id, startDate, endDate, reason],
        (err, results) => {
          if (err) {
            console.error("Error inserting leave request:", err);
            return res.status(500).json({ error: "Database error" });
          }

          connection.query(
            "UPDATE Users SET leave_balance = leave_balance - ? WHERE id = ?",
            [totalDays, user_id],
            (err) => {
              if (err) {
                console.error("Error updating leave balance:", err);
                return res
                  .status(500)
                  .json({ error: "Database error updating leave balance" });
              }

              res
                .status(201)
                .json({
                  message: "Leave request submitted",
                  id: results.insertId,
                });
            }
          );
        }
      );
    }
  );
});

router.get("/user/:id/latest", (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT status FROM LeaveRequests 
    WHERE user_id = ? 
    ORDER BY created_at DESC 
    LIMIT 1
  `;

  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    
    if (results.length > 0) {
      res.json(results[0]); // Return the latest leave request status
    } else {
      res.json(null); // No leave requests found
    }
  });
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    // Get current leave request details
    connection.query(
      "SELECT user_id, start_date, end_date, status FROM LeaveRequests WHERE id = ?",
      [id],
      (err, results) => {
        if (err || results.length === 0) {
          console.error("Error fetching leave request:", err);
          return res.status(500).json({ error: "Database error or request not found" });
        }

        const leaveRequest = results[0];
        const { user_id, start_date, end_date, status: oldStatus } = leaveRequest;

        // Correctly calculate total leave days (including start & end date)
        const startDate = new Date(start_date);
        const endDate = new Date(end_date);

        const totalDays = Math.max(
          Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) ,
          1
        );
        console.log("Total days:", totalDays);
        

        let balanceUpdateQuery = "";
        let balanceUpdateParams = [];

        // If changing from approved → rejected (restore balance)
        if (oldStatus === "approved" && status === "rejected") {
          balanceUpdateQuery = "UPDATE Users SET leave_balance = leave_balance + ? WHERE id = ?";
          balanceUpdateParams = [totalDays, user_id];
        }

        // If changing from rejected → approved (deduct balance)
        else if (oldStatus === "rejected" && status === "approved") {
          balanceUpdateQuery = "UPDATE Users SET leave_balance = leave_balance - ? WHERE id = ?";
          balanceUpdateParams = [totalDays, user_id];
        }

        // Run balance update if needed
        if (balanceUpdateQuery) {
          connection.query(balanceUpdateQuery, balanceUpdateParams, (err) => {
            if (err) {
              console.error("Error updating leave balance:", err);
              return res.status(500).json({ error: "Failed to update leave balance" });
            }

            // Update the leave request status
            connection.query(
              "UPDATE LeaveRequests SET status = ? WHERE id = ?",
              [status, id],
              (err) => {
                if (err) {
                  console.error("Error updating leave status:", err);
                  return res.status(500).json({ error: "Failed to update leave status" });
                }
                res.json({ message: "Leave request and balance updated successfully" });
              }
            );
          });
        } else {
          // Only update status if no balance change is required
          connection.query(
            "UPDATE LeaveRequests SET status = ? WHERE id = ?",
            [status, id],
            (err) => {
              if (err) {
                console.error("Error updating leave status:", err);
                return res.status(500).json({ error: "Failed to update leave status" });
              }
              res.json({ message: "Leave request updated successfully" });
            }
          );
        }
      }
    );
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Get leave history for a manager (last 24 hours)
router.get("/history/:manager_id", (req, res) => {
  const { manager_id } = req.params;

  const query = `
    SELECT 
      lr.id, 
      lr.user_id, 
      u.name AS user_name, 
      lr.leave_type_id, 
      lt.type_name AS leaveType, 
      lr.start_date as startDate, 
      lr.end_date as endDate, 
      lr.reason, 
      lr.status, 
      lr.created_at
    FROM LeaveRequests lr
    LEFT JOIN Users u ON lr.user_id = u.id
    LEFT JOIN LeaveTypes lt ON lr.leave_type_id = lt.id
    WHERE lr.manager_id = ? 
    AND lr.status IN ('approved', 'rejected') 
    AND TIMESTAMPDIFF(HOUR, lr.created_at, NOW()) <= 24
    ORDER BY lr.created_at DESC
  `;

  connection.query(query, [manager_id], (err, results) => {
    if (err) {
      console.error("Error fetching confirmed leave requests:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

// ✅ Delete a leave request
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  connection.query(
    "DELETE FROM LeaveRequests WHERE id = ?",
    [id],
    (err, results) => {
      if (err) {
        console.error("Error deleting leave request:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json({ message: "Leave request deleted" });
    }
  );
});

module.exports = router;
