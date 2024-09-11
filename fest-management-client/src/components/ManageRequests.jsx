import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ManageRequests() {
  const [requests, setRequests] = useState([]);
  const [fests, setFests] = useState([]);
  const [showFests, setShowFests] = useState(false);
  const [showRequests, setShowRequests] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchRequests = () => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:5000/admin-requests", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setRequests(response.data);
      })
      .catch((error) => {
        console.error("Error fetching requests:", error);
        setError(error);
      });
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = (requestId) => {
    const token = localStorage.getItem("token");
    axios
      .post(
        `http://localhost:5000/manage-request/${requestId}`,
        { action: "approve" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        alert("Request approved successfully");
        setRequests(requests.filter((request) => request._id !== requestId));
      })
      .catch((error) => {
        console.error("Error approving request:", error);
      });
  };

  const handleReject = (requestId) => {
    const token = localStorage.getItem("token");
    axios
      .post(
        `http://localhost:5000/manage-request/${requestId}`,
        { action: "reject" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        alert("Request rejected successfully");
        setRequests(requests.filter((request) => request._id !== requestId));
      })
      .catch((error) => {
        console.error("Error rejecting request:", error);
      });
  };

  const handleShowFests = () => {
    if (showFests) {
      // If already showing fests, hide them
      setShowFests(false);
    } else {
      // Fetch and show fests
      const token = localStorage.getItem("token");
      axios
        .get("http://localhost:5000/all-fests", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          if (response.data.length === 0) {
            setFests([]); // Set fests to an empty array
          } else {
            setFests(response.data);
          }
          setShowFests(true);
          setShowRequests(false);
        })
        .catch((error) => {
          console.error("Error fetching fests:", error);
          setError(error);
        });
    }
  };

  const handleShowRequests = () => {
    if (showRequests) {
      // If already showing requests, hide them
      setShowRequests(false);
    } else {
      // Show requests
      setShowRequests(true);
      setShowFests(false);
    }
  };

  const handleDeleteFest = (festId) => {
    const token = localStorage.getItem("token");
    axios
      .delete(`http://localhost:5000/manage-delete-fest/${festId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        alert("Fest deleted successfully");
        setFests(fests.filter((fest) => fest._id !== festId));
      })
      .catch((error) => {
        console.error("Error deleting fest:", error);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-teal-400 to-blue-500">
      <div className="container mx-auto p-8 bg-white rounded-lg shadow-xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800">
            Super Admin Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white p-4 rounded-lg shadow-lg transform transition-transform hover:scale-105 hover:shadow-2xl"
          >
            Logout
          </button>
        </div>
        {error && <div className="text-red-500 mb-4">{error.message}</div>}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={handleShowFests}
            className={`bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold p-4 rounded-lg shadow-lg transform transition-transform hover:scale-105 hover:shadow-2xl ${showFests ? 'bg-purple-700' : ''}`}
          >
            {showFests ? "Hide Fests" : "Show Fests"}
          </button>
          <button
            onClick={handleShowRequests}
            className={`bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold p-4 rounded-lg shadow-lg transform transition-transform hover:scale-105 hover:shadow-2xl ${showRequests ? 'bg-green-700' : ''}`}
          >
            {showRequests ? "Hide Requests" : "Show Requests"}
          </button>
        </div>
        {showFests && (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
              All Fests
            </h2>
            {fests.length === 0 ? (
              <p className="text-center text-gray-700">No fests available</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {fests.map((fest) => (
                  <div
                    key={fest._id}
                    className="border p-6 rounded-lg shadow-xl bg-white transform transition-transform hover:scale-105 hover:shadow-2xl"
                  >
                    <div className="flex justify-center mb-4">
                      <img
                        src={fest.logoUrl}
                        alt="Fest Logo"
                        className="w-32 h-32 rounded-full shadow-md"
                      />
                    </div>
                    <h2 className="text-2xl font-semibold text-center text-gray-900 mb-4">
                      {fest.festName}
                    </h2>
                    <p className="text-gray-700 text-center mb-4">
                      {fest.description}
                    </p>
                    <p className="text-gray-700 text-center mb-2">
                      <strong>Date:</strong> {new Date(fest.date).toLocaleDateString()}
                    </p>
                    <p className="text-gray-700 text-center mb-2">
                      <strong>College:</strong> {fest.collegeName}
                    </p>
                    <div className="flex justify-center">
                      <button
                        onClick={() => handleDeleteFest(fest._id)}
                        className="bg-red-500 text-white p-2 rounded mt-4 shadow-lg transform transition-transform hover:scale-105 hover:shadow-2xl"
                      >
                        Delete Fest
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {showRequests && requests.length === 0 ? (
          <div className="text-center text-gray-700">No pending requests</div>
        ) : (
          showRequests && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {requests.map((request) => (
                <div
                  key={request._id}
                  className="border p-6 rounded-lg shadow-lg bg-gray-50 transform transition-transform hover:scale-105 hover:shadow-2xl"
                >
                  <h2 className="text-2xl font-semibold mb-4">
                    {request.collegeName}
                  </h2>
                  <p className="text-gray-700 mb-2">
                    <strong>Email:</strong> {request.email}
                  </p>
                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() => handleApprove(request._id)}
                      className="bg-green-500 text-white p-2 rounded w-full mr-2 shadow-lg transform transition-transform hover:scale-105 hover:shadow-2xl"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(request._id)}
                      className="bg-red-500 text-white p-2 rounded w-full shadow-lg transform transition-transform hover:scale-105 hover:shadow-2xl"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default ManageRequests;
