import React, { useState, useEffect } from "react";
import axios from "axios";
import FestCard from "./FestCard";

function Dashboard() {
  const [fests, setFests] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/fests")
      .then((response) => setFests(response.data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">College Fests</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {fests.map((fest) => (
          <FestCard key={fest._id} fest={fest} />
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
