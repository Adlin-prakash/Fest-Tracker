import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function ViewFestsPage() {
  const [fests, setFests] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/view-fests")
      .then((response) => {
        setFests(response.data);
        const uniqueColleges = [
          ...new Set(response.data.map((fest) => fest.collegeName)),
        ];
        setColleges(uniqueColleges);
      })
      .catch((error) => {
        console.error("Error fetching fests:", error);
        setError(error);
      });
  }, []);

  const handleCollegeChange = (event) => {
    setSelectedCollege(event.target.value);
  };

  const handleFestClick = (festId) => {
    navigate(`/user-events/${festId}`);
  };

  const filteredFests = selectedCollege
    ? fests.filter((fest) => fest.collegeName === selectedCollege)
    : fests;

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!fests.length) {
    return <div>No Fests found...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-green-400 via-blue-500 to-purple-600">
      <div className="container mx-auto p-8 bg-gray-900 shadow-2xl rounded-lg">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-white">
          College Fests
        </h1>
        <div className="mb-8 flex justify-center">
          <select
            value={selectedCollege}
            onChange={handleCollegeChange}
            className="p-2 rounded bg-gray-700 text-white"
          >
            <option value="">All Colleges</option>
            {colleges.map((college, index) => (
              <option key={index} value={college}>
                {college}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredFests.map((fest) => (
            <div
              key={fest._id}
              className="border p-4 rounded-lg shadow-lg bg-gray-800 text-white transform transition-transform hover:scale-105 hover:shadow-2xl cursor-pointer"
              onClick={() => handleFestClick(fest._id)}
            >
              <img
                src={fest.logoUrl}
                alt="Fest Logo"
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-4">
                <h2 className="text-2xl font-semibold mb-2">{fest.festName}</h2>
                <p className="text-gray-400 mb-2">{fest.description}</p>
                <p className="text-gray-400 mb-2">
                  <strong>Date:</strong>{" "}
                  {new Date(fest.date).toLocaleDateString()}
                </p>
                <p className="text-gray-400">
                  <strong>College:</strong> {fest.collegeName}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-center space-x-4">
          <Link
            to="/"
            className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-transform hover:scale-105 hover:shadow-2xl"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ViewFestsPage;
