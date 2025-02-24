import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import NavBar from "../components/NavBar";
import {
  Container,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
} from "@mui/material";

const CreateLeaveType = () => {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [typeName, setTypeName] = useState("");
  const [description, setDescription] = useState("");

  // Fetch leave types
  const fetchLeaveTypes = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/leave-types");
      const data = await response.json();
      if (response.ok) {
        setLeaveTypes(data);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.error || "Failed to fetch leave types.",
        });
      }
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while fetching leave types.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveTypes();
  }, []);

  // Handle modal form submission
  const handleModalSubmit = async (e) => {
    e.preventDefault();

    if (!typeName.trim()) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Leave type name is required.",
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/leave-types", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type_name: typeName, description }),
      });
      const data = await response.json();
      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Leave type created successfully.",
          timer: 2000,
          showConfirmButton: false,
        });
        setTypeName("");
        setDescription("");
        setModalOpen(false);
        fetchLeaveTypes();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.error || "Creation failed.",
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while creating the leave type.",
      });
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <NavBar />
      <h2 style={{ textAlign: "center", marginBottom: "20px", fontSize: "24px", fontWeight: "bold" }}>
        Manage Leave Types
      </h2>

      {/* Button to open modal */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "16px" }}>
        <Button variant="contained" color="primary" onClick={() => setModalOpen(true)}>
          + Add Leave Type
        </Button>
      </div>

      {/* Leave Type Table */}
      {loading ? (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <CircularProgress />
        </div>
      ) : leaveTypes.length === 0 ? (
        <p style={{ textAlign: "center", color: "#777" }}>No leave types found.</p>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Leave Type Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Created At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leaveTypes.map((lt) => (
                <TableRow key={lt.id} hover>
                  <TableCell>{lt.id}</TableCell>
                  <TableCell>{lt.type_name}</TableCell>
                  <TableCell>{lt.description}</TableCell>
                  <TableCell>{lt.created_at && lt.created_at.slice(0, 10)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Modal for creating a new leave type */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
        <DialogTitle>Add New Leave Type</DialogTitle>
        <DialogContent>
          <form onSubmit={handleModalSubmit}>
            <TextField
              fullWidth
              label="Leave Type Name"
              variant="outlined"
              margin="dense"
              value={typeName}
              onChange={(e) => setTypeName(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="Description"
              variant="outlined"
              margin="dense"
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button type="submit" onClick={handleModalSubmit} color="primary" variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CreateLeaveType;
