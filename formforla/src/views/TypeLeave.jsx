import { useState, useEffect } from "react";
import Swal from "sweetalert2";
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
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const CreateLeaveType = () => {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [typeName, setTypeName] = useState("");
  const [description, setDescription] = useState("");
  const [typeNameError, setTypeNameError] = useState(false);
  const [editingId, setEditingId] = useState(null); // Stores the ID when editing

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
          title: "ข้อผิดพลาด",
          text: data.error || "ไม่สามารถดึงข้อมูลประเภทการลาได้",
        });
      }
    } catch {
      Swal.fire({
        icon: "error",
        title: "ข้อผิดพลาด",
        text: "เกิดข้อผิดพลาดขณะดึงข้อมูลประเภทการลา",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveTypes();
  }, []);

  // Handle Create or Edit
  const handleModalSubmit = async (e) => {
    e.preventDefault();

    if (!typeName.trim()) {
      setTypeNameError(true);
      return;
    } else {
      setTypeNameError(false);
    }

    try {
      const url = editingId
        ? `http://localhost:5000/api/leave-types/${editingId}`
        : "http://localhost:5000/api/leave-types";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type_name: typeName, description }),
      });

      const data = await response.json();
      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: editingId ? "อัปเดตแล้ว" : "สร้างแล้ว",
          text: `ประเภทการลา${editingId ? "อัปเดต" : "สร้าง"}เรียบร้อยแล้ว`,
          timer: 2000,
          showConfirmButton: false,
        });

        setTypeName("");
        setDescription("");
        setEditingId(null);
        setModalOpen(false);
        fetchLeaveTypes();
      } else {
        Swal.fire({
          icon: "error",
          title: "ข้อผิดพลาด",
          text: data.error || "ไม่สามารถดำเนินการได้",
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "ข้อผิดพลาด",
        text: "เกิดข้อผิดพลาดขณะดำเนินการ",
      });
    }
  };

  // Handle Edit Click
  const handleEditClick = (leaveType) => {
    setEditingId(leaveType.id);
    setTypeName(leaveType.type_name);
    setDescription(leaveType.description);
    setModalOpen(true);
  };

  // Handle Delete
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "คุณจะไม่สามารถย้อนกลับได้!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#50B498",
      confirmButtonText: "ใช่, ลบเลย!",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:5000/api/leave-types/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          Swal.fire({
            icon: "success",
            title: "ลบแล้ว!",
            text: "ประเภทการลาถูกลบเรียบร้อยแล้ว",
            timer: 2000,
            showConfirmButton: false,
          });

          fetchLeaveTypes();
        } else {
          Swal.fire({
            icon: "error",
            title: "ข้อผิดพลาด",
            text: "ไม่สามารถลบประเภทการลาได้",
          });
        }
      } catch {
        Swal.fire({
          icon: "error",
          title: "ข้อผิดพลาด",
          text: "เกิดข้อผิดพลาดขณะลบประเภทการลา",
        });
      }
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h5" fontWeight="bold" textAlign="start" sx={{ mb: 2 }}>
        จัดการประเภทการลา
      </Typography>

      {/* Button to open modal */}
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button
          variant="contained"
          sx={{ backgroundColor: "#50B498", color: "white" }}
          onClick={() => {
            setEditingId(null);
            setTypeName("");
            setDescription("");
            setModalOpen(true);
          }}
        >
          + เพิ่มประเภทการลา
        </Button>
      </Box>

      {/* Leave Type Table */}
      {loading ? (
        <Box textAlign="center" mt={3}>
          <CircularProgress />
        </Box>
      ) : leaveTypes.length === 0 ? (
        <Typography textAlign="center" color="gray">
          ไม่พบประเภทการลา
        </Typography>
      ) : (
        <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#50B498" }}>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>ID</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>ชื่อประเภทการลา</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>คำอธิบาย</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>การกระทำ</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leaveTypes.map((lt, index) => (
                <TableRow key={lt.id} hover>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{lt.type_name}</TableCell>
                  <TableCell>{lt.description}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleEditClick(lt)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(lt.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Modal for creating/editing a leave type */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
        <DialogTitle textAlign="center" sx={{ fontWeight: "bold", backgroundColor: "#50B498", color: "white" }}>
          {editingId ? "แก้ไขประเภทการลา" : "เพิ่มประเภทการลาใหม่"}
        </DialogTitle>
        <form onSubmit={handleModalSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              label="ชื่อประเภทการลา"
              variant="outlined"
              margin="dense"
              value={typeName}
              onChange={(e) => setTypeName(e.target.value)}
              error={typeNameError}
              helperText={typeNameError ? "ชื่อประเภทการลาจำเป็นต้องระบุ" : ""}
              required
            />
            <TextField
              fullWidth
              label="คำอธิบาย"
              variant="outlined"
              margin="dense"
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setModalOpen(false)} color="secondary">
              ยกเลิก
            </Button>
            <Button type="submit" sx={{ backgroundColor: "#50B498", color: "white" }}>
              {editingId ? "อัปเดต" : "สร้าง"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default CreateLeaveType;
