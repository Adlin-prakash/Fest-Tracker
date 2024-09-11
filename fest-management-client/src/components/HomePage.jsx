import React from "react";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-500 to-blue-500">
      <div className="container mx-auto p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-800">
          Welcome to the Fest Management System
        </h1>
        <div className="flex flex-row items-center justify-center space-x-6">
          <Link
            to="/mainadmin-login"
            className="bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold p-4 rounded-lg shadow-lg transform transition-transform hover:scale-105 hover:shadow-2xl"
          >
            Main Admin
          </Link>
          <Link
            to="/login"
            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold p-4 rounded-lg shadow-lg transform transition-transform hover:scale-105 hover:shadow-2xl"
          >
            College Admin Login
          </Link>
          <Link
            to="/register"
            className="bg-gradient-to-r from-red-400 to-pink-500 text-white font-semibold p-4 rounded-lg shadow-lg transform transition-transform hover:scale-105 hover:shadow-2xl"
          >
            College Admin Register
          </Link>
          <Link
            to="/view-fests"
            className="bg-gradient-to-r from-purple-400 to-blue-600 text-white font-semibold p-4 rounded-lg shadow-lg transform transition-transform hover:scale-105 hover:shadow-2xl"
          >
            View Fests
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
