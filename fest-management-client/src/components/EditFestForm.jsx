import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function EditFestForm() {
  const { festId } = useParams();
  const [form, setForm] = useState({
    festName: "",
    description: "",
    date: "",
    logoUrl: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get(`http://localhost:5000/fests/${festId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const festData = response.data;
          setForm({
            festName: festData.festName || "",
            description: festData.description || "",
            date: festData.date
              ? new Date(festData.date).toISOString().substring(0, 10)
              : "",
            logoUrl: festData.logoUrl || "",
          });
        })
        .catch((error) => {
          console.error("Error fetching fest:", error);
          setError(
            error.response ? error.response.data : "Error fetching fest"
          );
        });
    } else {
      setError("No token found");
    }
  }, [festId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    axios
      .put(`http://localhost:5000/update-fest/${festId}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        alert("Fest updated successfully!");
        navigate(`/admin`);
      })
      .catch((error) => {
        console.error("Error updating fest:", error);
        setError(error.response ? error.response.data : "Error updating fest");
      });
  };

  const handleCancel = () => {
    navigate(`/admin`);
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <div className="container mx-auto p-8 bg-white shadow-2xl rounded-lg hover:shadow-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Edit Fest
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Fest Name</label>
            <input
              type="text"
              name="festName"
              value={form.festName}
              onChange={handleChange}
              className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Logo URL</label>
            <input
              type="text"
              name="logoUrl"
              value={form.logoUrl}
              onChange={handleChange}
              className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            />
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transform transition-transform hover:scale-105"
            >
              Update Fest
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="w-full py-3 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transform transition-transform hover:scale-105"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditFestForm;
