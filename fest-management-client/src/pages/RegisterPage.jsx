import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const [form, setForm] = useState({
    collegeName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false); // State to manage password visibility
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    const { collegeName, email, password } = form;
    
    if (!collegeName || !email || !password) {
      setError("All fields are required");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Invalid email format");
      return;
    }

    // Password validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!passwordRegex.test(password)) {
      setError("Password must contain at least one letter and one number");
      return;
    }

    axios
      .post("http://localhost:5000/register", form)
      .then((response) => {
        alert("Wait for admin to approve your registration");
        navigate("/");
      })
      .catch((error) => {
        console.error("Error during registration:", error);
        setError(error.response?.data?.error || "Error during registration");
      });
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword); // Toggle password visibility
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-teal-400 to-blue-500">
      <div className="container max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-extrabold mb-8 text-center text-gray-800">
          Register
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2">
              College Name
            </label>
            <input
              type="text"
              name="collegeName"
              value={form.collegeName}
              onChange={handleChange}
              className="border p-3 w-full rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="border p-3 w-full rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"} // Toggle between text and password
              name="password"
              value={form.password}
              onChange={handleChange}
              className="border p-3 w-full rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
              required
            />
            <div className="mt-2">
              <label className="text-gray-700">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={toggleShowPassword}
                  className="mr-2"
                />
                Show Password
              </label>
            </div>
          </div>
          {error && <p className="text-red-500 mt-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-teal-400 to-blue-500 text-white font-bold py-3 rounded-lg shadow-lg transform transition-transform hover:scale-105 hover:shadow-2xl"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
