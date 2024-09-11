import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

function AddFestForm({ onClose }) {
  const [form, setForm] = useState({
    festName: "",
    description: "",
    date: "",
    collegeName: "",
    logoUrl: "",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setForm((prevForm) => ({
        ...prevForm,
        collegeName: decoded.collegeName || "",
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      await axios.post("http://localhost:5000/add-fest", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Fest added successfully!");
      onClose();
    } catch (error) {
      console.error("Error adding fest:", error);
      setError(error.response ? error.response.data : "Error adding fest");
    }
  };

  return (
    <div className="container mx-auto p-8 bg-white shadow-lg rounded">
      <h1 className="text-2xl font-bold mb-4">Add Fest</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Fest Name</label>
          <input
            type="text"
            name="festName"
            value={form.festName}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">College Name</label>
          <input
            type="text"
            name="collegeName"
            value={form.collegeName}
            readOnly
            className="border p-2 w-full bg-gray-200 cursor-not-allowed"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Logo URL</label>
          <input
            type="text"
            name="logoUrl"
            value={form.logoUrl}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Add Fest
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </form>
    </div>
  );
}

export default AddFestForm;
