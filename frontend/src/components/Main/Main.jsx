import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Main = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProtectedData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }
        const response = await axios.get("https://geotagger-cwu7.onrender.com/auth/protected", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data.user);
      } catch (err) {
        navigate("/login");
        setError(err.response?.data?.message || "Failed to fetch protected data");
      }
    };
    fetchProtectedData();
  }, [navigate]);

  if (error) return <div className="text-red-600 font-bold">{error}</div>;
  if (!user) return <div className="text-gray-600 font-semibold">Loading...</div>;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 via-blue-500 to-purple-600">
      <div className="w-full max-w-md bg-white bg-opacity-90 p-8 rounded-lg shadow-xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Protected Page</h1>
        <h2 className="text-2xl font-semibold text-gray-800 text-center">Welcome, {user.username}</h2>
        <h3 className="text-lg text-gray-600 text-center">Your email is {user.email}</h3>
        <div className="flex justify-center mt-8 space-x-4">
          <button onClick={handleLogout} className="w-32 h-12 bg-indigo-500 text-white rounded-full shadow-lg hover:scale-105">Logout</button>
          <Link to="/map">
            <button className="w-32 h-12 bg-purple-500 text-white rounded-full shadow-lg hover:scale-105">Map</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Main;
