import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import Modal from "./Modal"; // Import the Modal component

function FestEventsPage() {
  const { festId } = useParams();
  const [fest, setFest] = useState(null);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEventId, setCurrentEventId] = useState(null);
  const [status, setStatus] = useState("ongoing");
  const [currentRound, setCurrentRound] = useState("");
  const [roundDetails, setRoundDetails] = useState([]);
  const [winnerName, setWinnerName] = useState("");
  const [winnerCollege, setWinnerCollege] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get(`http://localhost:5000/fests/${festId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setFest(response.data);
        })
        .catch((error) => {
          console.error("Error fetching fest:", error);
          setError(error);
        });
    } else {
      setError("No token found");
    }
  }, [festId]);

  const handleDeleteEvent = (eventId) => {
    const token = localStorage.getItem("token");
    axios
      .delete(`http://localhost:5000/delete-event/${festId}/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        alert("Event deleted successfully");
        setFest((prevFest) => ({
          ...prevFest,
          events: prevFest.events.filter((event) => event._id !== eventId),
        }));
      })
      .catch((error) => {
        console.error("Error deleting event:", error);
      });
  };

  const handleUpdateRound = () => {
    const token = localStorage.getItem("token");
    axios
      .put(
        `http://localhost:5000/update-event-status-round/${festId}/${currentEventId}`,
        { status, roundDetails, currentRound, winnerName, winnerCollege },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        alert("Event status and round details updated successfully!");
        setFest((prevFest) => {
          const updatedEvents = prevFest.events.map((event) =>
            event._id === currentEventId
              ? {
                  ...event,
                  status,
                  roundDetails,
                  currentRound,
                  winnerName,
                  winnerCollege,
                }
              : event
          );
          return { ...prevFest, events: updatedEvents };
        });
        setIsModalOpen(false);
      })
      .catch((error) => {
        console.error("Error updating event status and round details:", error);
      });
  };

  const openModal = (event) => {
    setCurrentEventId(event._id);
    setStatus(event.status);
    setCurrentRound(event.currentRound);
    setRoundDetails(event.roundDetails || []);
    setWinnerName(event.winnerName || "");
    setWinnerCollege(event.winnerCollege || "");

    const token = localStorage.getItem("token");
    axios
      .get(`http://localhost:5000/event-details/${festId}/${event._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setStatus(response.data.status);
        setCurrentRound(response.data.currentRound);
        setRoundDetails(response.data.roundDetails);
        setWinnerName(response.data.winnerName || "");
        setWinnerCollege(response.data.winnerCollege || "");
        setIsModalOpen(true);
      })
      .catch((error) => {
        console.error("Error fetching event details:", error);
      });
  };

  const handleRoundChange = (index, e) => {
    const updatedRoundDetails = roundDetails.map((round, i) =>
      i === index ? { ...round, [e.target.name]: e.target.value } : round
    );
    setRoundDetails(updatedRoundDetails);
  };

  const handleAddRound = () => {
    setRoundDetails([...roundDetails, { roundNumber: "", timing: "" }]);
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!fest) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-green-500 via-teal-500 to-blue-500">
      <div className="container mx-auto p-8 bg-gray-800 text-white shadow-2xl rounded-lg">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-white">
          {fest.festName} Events
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {fest.events.map((event) => (
            <div
              key={event._id}
              className="border p-6 rounded-lg shadow-lg bg-gray-700 transform transition-transform hover:scale-105 hover:shadow-2xl"
            >
              <img
                src={event.logoUrl}
                alt="Event Logo"
                className="mb-4 rounded-lg w-full h-48 object-cover shadow-md"
              />
              <h2 className="text-2xl font-semibold mb-2 text-center text-white">
                {event.eventName}
              </h2>
              <h3 className="text-center text-gray-300 mb-4">
                {event.description}
              </h3>
              <p className="text-gray-300 mb-2 text-center">
                <strong>Date:</strong>{" "}
                {new Date(event.eventDate).toLocaleDateString()}
              </p>
              <p className="text-gray-300 mb-2 text-center">
                <strong>Participants:</strong> {event.participants}
              </p>
              <p className="text-gray-300 mb-2 text-center">
                <strong>Sponsor:</strong> {event.sponsor}
              </p>
              {/* <p className="text-gray-300 mb-2 text-center">
                <strong>Number of Rounds:</strong> {event.rounds}
              </p>
              <p className="text-gray-300 mb-2 text-center">
                <strong>Host Name:</strong> {event.hostName}
              </p>
              <p className="text-gray-300 mb-2 text-center">
                <strong>Phone Number:</strong> {event.phoneNumber}
              </p> */}
              <div className="flex justify-center mt-4">
                <Link
                  to={`/edit-event/${festId}/${event._id}`}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded shadow-md transform transition-transform hover:scale-105 hover:shadow-2xl mr-2"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDeleteEvent(event._id)}
                  className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded shadow-md transform transition-transform hover:scale-105 hover:shadow-2xl"
                >
                  Delete
                </button>
                <button
                  onClick={() => openModal(event)}
                  className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded shadow-md transform transition-transform hover:scale-105 hover:shadow-2xl ml-2"
                >
                  Update Round
                </button>
              </div>
            </div>
          ))}
        </div>

        <div
          className="mt-8 flex justify-center space-x-4"
          onClick={() => navigate("/admin")}
        >
          <button
            onClick={() => navigate("/admin")}
            className="mb-8 bg-yellow-500 text-black p-2 rounded shadow-md transform transition-transform hover:scale-105 hover:shadow-2xl"
          >
            Back to Admin Dashboard
          </button>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleUpdateRound}
        status={status}
        setStatus={setStatus}
        currentRound={currentRound}
        setCurrentRound={setCurrentRound}
        roundDetails={roundDetails}
        setRoundDetails={setRoundDetails}
        handleRoundChange={handleRoundChange}
        handleAddRound={handleAddRound}
        winnerName={winnerName}
        setWinnerName={setWinnerName}
        winnerCollege={winnerCollege}
        setWinnerCollege={setWinnerCollege}
      />
    </div>
  );
}

export default FestEventsPage;
