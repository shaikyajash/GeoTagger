import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [data, setData] = useState({
    email: "",
    username: "",
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
      const url = "http://localhost:5000/auth/signup";
      const payload = {
        email: data.email,
        username: data.username,
        password: data.password,
      };

      const response = await axios.post(url, payload);

      setMessage(response.data.message); // Displaying the message from the backend

      setTimeout(() => {
        navigate("/login"); // Redirect to login after 2 seconds
      }, 2000);
    } catch (error) {
      // Handle error: display error message from backend
      setMessage(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 via-blue-500 to-purple-600">
      <div className="w-full max-w-md p-8 bg-white bg-opacity-90 backdrop-blur-lg rounded-lg shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome Back</h1>
          <Link to="/login">
            <button
              type="button"
              className="w-40 h-12 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105"
            >
              SignIn
            </button>
          </Link>
        </div>

        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Signup</h1>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6 bg-white p-6 rounded-lg border border-gray-300 shadow-lg"
          >
            <h2 className="text-2xl font-semibold text-gray-700 text-center">
              Create Account
            </h2>

            <input
              type="text"
              placeholder="Username"
              name="username"
              onChange={handleChange}
              value={data.username}
              required
              className="h-12 rounded-lg border border-gray-300 bg-gray-100 text-gray-800 font-medium px-4 outline-none placeholder-gray-500 focus:border-indigo-500 transition"
            />

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
              className="w-40 h-12 mx-auto mt-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105"
            >
              Signup
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
      </div>
    </div>
  );
};

export default Signup;