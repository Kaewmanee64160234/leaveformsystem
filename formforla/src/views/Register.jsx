// src/components/Register.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AlertBix from "../components/AlertBox"; // Import the AlertBix component

const Register = () => {
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole]         = useState("employee"); // default role
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate              = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous messages
    setErrorMessage("");
    setSuccessMessage("");

    // Validate username length
    if (name.trim().length < 3) {
      setErrorMessage("Username must be at least 3 characters long.");
      return;
    }

    // Validate password security
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setErrorMessage("Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/register", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ name, email, password, role })
      });
      const data = await response.json();
      if (response.ok) {
         setSuccessMessage("Registration successful! Please log in.");
         // Redirect after a short delay to let the user read the message.
         setTimeout(() => {
           navigate("/login");
         }, 2000);
      } else {
         setErrorMessage(data.error || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("An error occurred");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-light">
      <form
        onSubmit={handleSubmit}
        className="bg-primary p-6 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-light">
          Register
        </h2>
        <AlertBix message={errorMessage} type="error" />
        <AlertBix message={successMessage} type="success" />
        <div className="mb-4">
          <label className="block text-light">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-secondary rounded focus:outline-none focus:ring-2 focus:ring-accent"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-light">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-secondary rounded focus:outline-none focus:ring-2 focus:ring-accent"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-light">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-secondary rounded focus:outline-none focus:ring-2 focus:ring-accent"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-light">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-2 border border-secondary rounded focus:outline-none focus:ring-2 focus:ring-accent"
            required
          >
            <option value="employee">Employee</option>
            <option value="manager">Manager</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-accent hover:bg-secondary text-primary p-2 rounded font-semibold transition-colors duration-200"
        >
          Register
        </button>
        <p className="mt-4 text-center text-light">
          Already have an account?{" "}
          <a href="/login" className="text-secondary underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
};

export default Register;
