import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function EventDetailPage() {
  const { festId, eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/user-event-detail/${festId}/${eventId}`)
      .then((response) => {
        setEvent(response.data);
      })
      .catch((error) => {
        console.error("Error fetching event details:", error);
        setError(error);
      });
  }, [festId, eventId]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-500 text-white p-4 rounded-lg shadow-lg">
          Error: {error.message}
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-700 text-2xl font-bold animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-8">
      <div className="container mx-auto bg-white shadow-2xl rounded-lg p-8 max-w-3xl">
        <h1 className="text-5xl font-extrabold mb-8 text-center text-gray-800">
          {event.eventName}
        </h1>
        <div className="flex justify-center mb-8">
          <img
            src={event.logoUrl}
            alt="Event Logo"
            className="w-full h-64 object-cover rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
          />
        </div>
        <div className="text-lg space-y-4">
          <p className="text-gray-700">
            <strong className="font-bold text-indigo-600">Description:</strong>{" "}
            {event.description}
          </p>
          <p className="text-gray-700">
            <strong className="font-bold text-indigo-600">Sponsor:</strong>{" "}
            {event.sponsor}
          </p>
          <p className="text-gray-700">
            <strong className="font-bold text-indigo-600">Date:</strong>{" "}
            {new Date(event.eventDate).toLocaleDateString()}
          </p>
          <p className="text-gray-700">
            <strong className="font-bold text-indigo-600">Participants:</strong>{" "}
            {event.participants}
          </p>
          <p className="text-gray-700">
            <strong className="font-bold text-indigo-600">Host Name:</strong>{" "}
            {event.hostName}
          </p>
          <p className="text-gray-700">
            <strong className="font-bold text-indigo-600">Phone Number:</strong>{" "}
            {event.phoneNumber}
          </p>
          <p className="text-gray-700">
            <strong className="font-bold text-indigo-600">Timing:</strong>{" "}
            {event.timing}
          </p>
          <p className="text-gray-700">
            <strong className="font-bold text-indigo-600">Rules:</strong>{" "}
            {event.rules}
          </p>
          <p className="text-gray-700">
            <strong className="font-bold text-indigo-600">Location:</strong>{" "}
            {event.location}
          </p>
          <p className="text-gray-700">
            <strong className="font-bold text-indigo-600">
              Current Round:
            </strong>{" "}
            {event.currentRound}
          </p>
          <p className="text-gray-700">
            <strong className="font-bold text-indigo-600">Status:</strong>{" "}
            {event.status}
          </p>
          <p className="text-gray-700">
            <strong className="font-bold text-indigo-600">Winner Name:</strong>{" "}
            {event.winnerName}
          </p>
          <p className="text-gray-700">
            <strong className="font-bold text-indigo-600">
              Winner College:
            </strong>{" "}
            {event.winnerCollege}
          </p>
        </div>
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-transform hover:scale-105 hover:shadow-2xl"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default EventDetailPage;
