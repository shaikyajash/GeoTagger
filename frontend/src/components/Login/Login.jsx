import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = "https://geotagger-cwu7.onrender.com/auth/login";
      const response = await axios.post(url, data);

      if (response.data.token) {
        // Save the token in localStorage
        localStorage.setItem("token", response.data.token);
        // Redirect to the home page after login

        navigate("/");
        
      }
    } catch (error) {
      // Display the error message
      setMessage(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className="w-full max-w-md p-8 bg-white bg-opacity-90 backdrop-blur-lg rounded-lg shadow-xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 animate-fadeIn">Login</h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 bg-white p-6 rounded-lg border border-gray-300 shadow-lg"
        >
          <h2 className="text-2xl font-semibold text-gray-700">
            Login to your account
          </h2>
          <input
            type="email"
            placeholder="Email"
            name="email"
            onChange={handleChange}
            value={data.email}
            required
            className="h-12 rounded-lg border border-gray-300 bg-gray-100 text-gray-800 font-medium px-4 outline-none placeholder-gray-500 focus:border-indigo-500 transition"
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={handleChange}
            value={data.password}
            required
            className="h-12 rounded-lg border border-gray-300 bg-gray-100 text-gray-800 font-medium px-4 outline-none placeholder-gray-500 focus:border-indigo-500 transition"
          />
          <button
            type="submit"
            className="w-40 h-12 mx-auto mt-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105"
          >
            Login
          </button>
        </form>

        {message && (
          <div
            className={`mt-4 p-3 text-center rounded ${
              message.includes("successfully") ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100"
            }`}
          >
            <p>{message}</p>
          </div>
        )}
      </div>
      <div className="ml-10 mt-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">New User?</h2>
        <Link to="/signup">
          <button
            type="button"
            className="w-40 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105"
          >
            Signup
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Login;