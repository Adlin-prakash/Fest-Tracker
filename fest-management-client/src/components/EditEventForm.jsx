import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function EditEventForm() {
  const { festId, eventId } = useParams();
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
    roundDetails: [{ roundNumber: "", timing: "" }], // Initialize with one round detail
    winnerName: "",
    winnerCollege: "",
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
          const event = response.data.events.find(
            (event) => event._id === eventId
          );
          if (event) {
            setForm({
              ...event,
              eventDate: new Date(event.eventDate).toISOString().split("T")[0], // Format date to yyyy-MM-dd
              rounds: event.rounds || "",
              hostName: event.hostName || "",
              phoneNumber: event.phoneNumber || "",
              timing: event.timing || "",
              rules: event.rules || "",
              status: event.status || "ongoing",
              location: event.location || "",
              currentRound: event.currentRound || "",
              roundDetails: event.roundDetails.length
                ? event.roundDetails
                : [{ roundNumber: "", timing: "" }],
              winnerName: event.winner?.name || "",
              winnerCollege: event.winner?.college || "",
            });
          } else {
            setError("Event not found");
          }
        })
        .catch((error) => {
          console.error("Error fetching event:", error);
          setError(
            error.response ? error.response.data : "Error fetching event"
          );
        });
    } else {
      setError("No token found");
    }
  }, [festId, eventId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRoundChange = (index, e) => {
    const updatedRoundDetails = form.roundDetails.map((round, i) =>
      i === index ? { ...round, [e.target.name]: e.target.value } : round
    );
    setForm({ ...form, roundDetails: updatedRoundDetails });
  };

  const handleAddRound = () => {
    setForm({
      ...form,
      roundDetails: [...form.roundDetails, { roundNumber: "", timing: "" }],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    // Ensure roundDetails has at least one valid entry
    if (form.roundDetails.length === 0) {
      setForm({
        ...form,
        roundDetails: [{ roundNumber: "1", timing: "10:00 AM" }],
      });
    }

    axios
      .put(
        `http://localhost:5000/update-event-status-round/${festId}/${eventId}`,
        form,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        alert("Event updated successfully!");
        navigate(`/fests/${festId}`);
      })
      .catch((error) => {
        console.error("Error updating event:", error);
        setError(error.response ? error.response.data : "Error updating event");
      });
  };

  const handleCancel = () => {
    navigate(`/fests/${festId}`);
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <div className="container mx-auto p-8 bg-white shadow-2xl rounded-lg hover:shadow-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Edit Event
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Event Name</label>
            <input
              type="text"
              name="eventName"
              value={form.eventName}
              onChange={handleChange}
              className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Event Date</label>
            <input
              type="date"
              name="eventDate"
              value={form.eventDate}
              onChange={handleChange}
              className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Participants</label>
            <input
              type="number"
              name="participants"
              value={form.participants}
              onChange={handleChange}
              className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Sponsor</label>
            <input
              type="text"
              name="sponsor"
              value={form.sponsor}
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
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Number of Rounds</label>
            <input
              type="number"
              name="rounds"
              value={form.rounds}
              onChange={handleChange}
              className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Host Name</label>
            <input
              type="text"
              name="hostName"
              value={form.hostName}
              onChange={handleChange}
              className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Timing</label>
            <input
              type="text"
              name="timing"
              value={form.timing}
              onChange={handleChange}
              className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Rules</label>
            <textarea
              name="rules"
              value={form.rules}
              onChange={handleChange}
              className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Status</label>
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
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Location</label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Current Round</label>
            <input
              type="text"
              name="currentRound"
              value={form.currentRound}
              onChange={handleChange}
              className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Round Details</label>
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
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Winner Name</label>
            <input
              type="text"
              name="winnerName"
              value={form.winnerName}
              onChange={handleChange}
              className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Winner College</label>
            <input
              type="text"
              name="winnerCollege"
              value={form.winnerCollege}
              onChange={handleChange}
              className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            />
          </div>
          <div className="flex justify-between">
            <button
              type="submit"
              className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transform transition-transform hover:scale-105"
            >
              Update Event
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="w-full py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transform transition-transform hover:scale-105 ml-4"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditEventForm;
