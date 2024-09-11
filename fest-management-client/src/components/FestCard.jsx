import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function FestCard({ fest }) {
  const navigate = useNavigate();

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/edit-fest/${fest._id}`);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5000/delete-fest/${fest._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Fest deleted successfully!");
      window.location.reload(); // Refresh the page to reflect the changes
    } catch (error) {
      console.error("Error deleting fest:", error);
      alert("Error deleting fest");
    }
  };

  const handleAddEvent = (e) => {
    e.stopPropagation();
    navigate(`/add-event/${fest._id}`);
  };

  const handleViewEvents = () => {
    navigate(`/fests/${fest._id}`);
  };

  return (
    <div
      className="border p-6 rounded-xl shadow-lg bg-white transform transition-transform hover:scale-105 hover:shadow-2xl cursor-pointer hover:bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 hover:text-white"
      onClick={handleViewEvents}
    >
      <img
        src={fest.logoUrl}
        alt="Fest Logo"
        className="mb-4 rounded-lg object-cover h-40 w-full transition-transform hover:scale-105"
      />
      <h2 className="text-2xl font-semibold mb-4">{fest.festName}</h2>
      <p className="mb-2">{fest.description}</p>
      <p className="mb-2">
        <strong>Date:</strong> {new Date(fest.date).toLocaleDateString()}
      </p>
      <p className="mb-2">
        <strong>College:</strong> {fest.collegeName}
      </p>
      <div className="flex justify-between mt-4 space-x-2">
        <button
          onClick={handleEdit}
          className="bg-gradient-to-r from-blue-400 to-blue-600 text-white py-2 px-4 rounded-full shadow-lg transform transition-transform hover:scale-105 hover:from-blue-500 hover:to-blue-700"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="bg-gradient-to-r from-red-400 to-red-600 text-white py-2 px-4 rounded-full shadow-lg transform transition-transform hover:scale-105 hover:from-red-500 hover:to-red-700"
        >
          Delete
        </button>
        <button
          onClick={handleAddEvent}
          className="bg-gradient-to-r from-green-400 to-green-600 text-white py-2 px-4 rounded-full shadow-lg transform transition-transform hover:scale-105 hover:from-green-500 hover:to-green-700"
        >
          Add Event
        </button>
      </div>
    </div>
  );
}

export default FestCard;
