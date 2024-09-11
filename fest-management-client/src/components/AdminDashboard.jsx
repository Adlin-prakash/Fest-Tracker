import React, { useEffect, useState } from "react";
import axios from "axios";
import FestCard from "./FestCard"; // Ensure FestCard component is correctly imported
import AddFestForm from "./AddFestForm"; // Import the AddFestForm component

function AdminDashboard() {
  const [fests, setFests] = useState([]);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchFests = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError(new Error("No token found"));
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/fests", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFests(response.data);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          setError(new Error("Access forbidden: Please login again."));
          localStorage.removeItem("token");
        } else {
          setError(error);
        }
      }
    };

    fetchFests();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  const handleAddFest = () => {
    setShowForm(!showForm);
  };

  const handleFormClose = () => {
    setShowForm(false);
    // Optionally, refetch fests to include the newly added fest
    const fetchFests = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError(new Error("No token found"));
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/fests", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFests(response.data);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          setError(new Error("Access forbidden: Please login again."));
          localStorage.removeItem("token");
        } else {
          setError(error);
        }
      }
    };

    fetchFests();
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-white">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded shadow-lg transition duration-300"
        >
          Logout
        </button>
      </div>
      <button
        onClick={handleAddFest}
        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded shadow-lg transition duration-300 mb-8"
      >
        {showForm ? "Close" : "Add Fest"}
      </button>
      {showForm && <AddFestForm onClose={handleFormClose} />}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
          {error.message}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-5">
        {fests.map((fest) => (
          <FestCard key={fest._id} fest={fest} />
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;
