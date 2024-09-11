import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

function UserEventPage() {
  const { festId } = useParams();
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/view-fest-events/${festId}`)
      .then((response) => {
        setEvents(response.data);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
        setError(error);
      });
  }, [festId]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-500 text-white p-4 rounded">
          Error: {error.message}
        </div>
      </div>
    );
  }

  if (!events.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-8">
        <div className="container mx-auto bg-white shadow-2xl rounded-lg p-8">
          <div className="text-4xl font-bold text-gray-700 text-center mb-8">
            No fest to display
          </div>
          <div className="flex justify-center">
            <Link
              to="/view-fests"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-transform hover:scale-105 hover:shadow-2xl"
            >
              Back to All Fests
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-8">
      <div className="container mx-auto bg-white shadow-2xl rounded-lg p-8">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-800">
          Fest Events
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <Link
              to={`/fests/${festId}/events/${event._id}`}
              key={event._id}
              className="border p-6 rounded-lg shadow-lg bg-gray-900 text-white transform transition-transform hover:scale-105 hover:shadow-2xl"
            >
              <img
                src={event.logoUrl}
                alt="Event Logo"
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-4">
                <h2 className="text-2xl font-semibold mb-2 text-center">
                  {event.eventName}
                </h2>
                <p className="text-gray-300 mb-2 text-left">
                  {event.description}
                </p>
                <p className="text-gray-300 mb-2 text-left">
                  <strong>Sponsor:</strong> {event.sponsor}
                </p>
                <p className="text-gray-300 mb-2 text-left">
                  <strong>Date:</strong>{" "}
                  {new Date(event.eventDate).toLocaleDateString()}
                </p>
                <p className="text-gray-300 mb-2 text-left">
                  <strong>Phone Number:</strong> {event.phoneNumber}
                </p>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <Link
            to="/view-fests"
            className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-transform hover:scale-105 hover:shadow-2xl"
          >
            Back to All Fests
          </Link>
        </div>
      </div>
    </div>
  );
}

export default UserEventPage;
