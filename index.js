// index.js

const express = require("express");
const cors = require("cors");
const userApi = require("./api/userApi");
const leaveRequestApi = require("./api/leaveRequestApi");
const leaveApprovalApi = require("./api/leaveApprovalApi");
const leaveTypeApi = require("./api/leaveTypeApi");
const employeeApi = require("./api/employeeApi");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Use API routes
app.use("/api/users", userApi);
app.use("/api/leave-requests", leaveRequestApi);
app.use("/api/leave-approvals", leaveApprovalApi);
app.use("/api/leave-types", leaveTypeApi);
app.use("/api/employees", employeeApi);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
