// src/components/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        // Save the token and user in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        // Redirect based on the user role
        if (data.user.role === "manager") {
          navigate("/leader-home");
        } else {
          navigate("/employee-home");
        }
      } else {
        alert(data.error || "Login failed");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-light">
      <form
        onSubmit={handleSubmit}
        className="bg-primary p-6 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-light">
          Login
        </h2>
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
        <button
          type="submit"
          className="w-full bg-accent hover:bg-secondary text-primary p-2 rounded font-semibold transition-colors duration-200"
        >
          Login
        </button>
        <p className="mt-4 text-center text-light">
          Don&apos;t have an account?{" "}
          <a href="/register" className="text-secondary underline">
            Register
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;
