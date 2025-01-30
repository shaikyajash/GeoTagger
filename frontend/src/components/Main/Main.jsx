import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Main = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // State to store the user details
  const [error, setError] = useState(""); // State to handle errors

  useEffect(() => {
    const fetchProtectedData = async () => {
      try {
        const token = localStorage.getItem("token"); // Get the token from localStorage
        const config = {
          headers: {
            Authorization: `Bearer ${token}`, // Setting the token in the header
          },
        };
        const response = await axios.get(
          "http://localhost:5000/auth/protected",
          config
        );
        setUser(response.data.user); // Setting the user details in state
      } catch (err) {
        window.location.href = "/login";
        setError(
          err.response?.data?.message || "Failed to fetch protected data"
        );
      }
    };
    fetchProtectedData();
  }, []);

  if (error) {
    return <div className="text-red-600 font-bold">{error}</div>;
  }
  if (!user) {
    return <div className="text-gray-600 font-semibold">Loading...</div>;
  }

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 via-blue-500 to-purple-600">
      <div className="w-full max-w-md bg-white bg-opacity-90 backdrop-blur-lg p-8 rounded-lg shadow-xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Protected Page</h1>

        {user ? (
          <div className="space-y-4 text-center">
            <h2 className="text-2xl font-semibold text-gray-800">
              Welcome, {user.username}
            </h2>
            <h3 className="text-lg text-gray-600">
              Your email is {user.email}
            </h3>
          </div>
        ) : (
          <div className="text-gray-600 font-semibold">Loading...</div>
        )}

        <div className="flex justify-center mt-8 space-x-4">
          <button
            onClick={handleLogout}
            className="w-32 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105"
          >
            Logout
          </button>
          <Link to="/map">
            <button
              type="button"
              className="w-32 h-12 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105"
            >
              Map
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Main;