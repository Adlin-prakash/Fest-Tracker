import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function AddEventForm() {
  const { festId } = useParams();
  const [form, setForm] = useState({
    eventName: "",
    eventDate: "",
    participants: "",
    sponsor: "",
    logoUrl: "",
    description: "",
    rounds: "",
    hostName: "",
    phoneNumber: "",
    timing: "",
    rules: "",
    status: "ongoing", // Default status
    location: "",
    currentRound: "",
    roundDetails: [], // Array to hold round details
    winnerName: "", // Winner details
    winnerCollege: "", // Winner details
  });

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddRound = () => {
    setForm({
      ...form,
      roundDetails: [...form.roundDetails, { roundNumber: "", timing: "" }],
    });
  };

  const handleRoundChange = (index, e) => {
    const updatedRoundDetails = form.roundDetails.map((round, i) =>
      i === index ? { ...round, [e.target.name]: e.target.value } : round
    );
    setForm({ ...form, roundDetails: updatedRoundDetails });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    console.log(form);

    axios
      .post(`http://localhost:5000/add-event/${festId}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        alert("Event added successfully!");
        navigate(`/admin`);
      })
      .catch((error) => {
        console.error("Error adding event:", error);
        setError(error.response ? error.response.data : "Error adding event");
      });
  };

  return (
    <div className="container mx-auto p-8 bg-white shadow-lg rounded">
      <h1 className="text-2xl font-bold mb-4">Add Event</h1>
      <form onSubmit={handleSubmit}>
        {/* Existing form fields */}
        <div className="mb-4">
          <label className="block text-gray-700">Event Name</label>
          <input
            type="text"
            name="eventName"
            value={form.eventName}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Event Date</label>
          <input
            type="date"
            name="eventDate"
            value={form.eventDate}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Participants</label>
          <input
            type="number"
            name="participants"
            value={form.participants}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Sponsor</label>
          <input
            type="text"
            name="sponsor"
            value={form.sponsor}
            onChange={handleChange}
            className="border p-2 w-full"
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
        <div className="mb-4">
          <label className="block text-gray-700">Number of Rounds</label>
          <input
            type="number"
            name="rounds"
            value={form.rounds}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Host Name</label>
          <input
            type="text"
            name="hostName"
            value={form.hostName}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Phone Number</label>
          <input
            type="text"
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Timing</label>
          <input
            type="text"
            name="timing"
            value={form.timing}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Rules</label>
          <textarea
            name="rules"
            value={form.rules}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="border p-2 w-full"
          >
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Location</label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Current Round</label>
          <input
            type="text"
            name="currentRound"
            value={form.currentRound}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Round Details</label>
          {form.roundDetails.map((round, index) => (
            <div key={index} className="mb-2">
              <input
                type="text"
                name="roundNumber"
                placeholder="Round Number"
                value={round.roundNumber}
                onChange={(e) => handleRoundChange(index, e)}
                className="border p-2 w-full mb-2"
              />
              <input
                type="text"
                name="timing"
                placeholder="Timing"
                value={round.timing}
                onChange={(e) => handleRoundChange(index, e)}
                className="border p-2 w-full"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddRound}
            className="bg-blue-500 text-white p-2 rounded mt-2"
          >
            Add Round
          </button>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Winner Name</label>
          <input
            type="text"
            name="winnerName"
            value={form.winnerName}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Winner College</label>
          <input
            type="text"
            name="winnerCollege"
            value={form.winnerCollege}
            onChange={handleChange}
            className="border p-2 w-full"
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
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Add Event
        </button>
        <button
          onClick={() => navigate("/admin")}
          className="bg-red-500 text-white p-2 rounded ml-4"
        >
          Cancel
        </button>
        {error && <p className="text-red-500 mt-4">{error.error || error}</p>}
      </form>
    </div>
  );
}

export default AddEventForm;
