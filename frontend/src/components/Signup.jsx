// Signup.jsx
import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import './Signup.css'; // Import the CSS file

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
      const url = "https://geotagger-cwu7.onrender.com/auth/signup";
      const payload = {
        email: data.email,
        username: data.username,
        password: data.password,
      };

      const response = await axios.post(url, payload);

      setMessage(response.data.message);

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <div className="welcome-back">
          <h1 className="welcome-title">Welcome Back</h1>
          <Link to="/login">
            <button type="button" className="btn signin-btn">
              SignIn
            </button>
          </Link>
        </div>

        <div>
          <h1 className="signup-title">Signup</h1>
          <form onSubmit={handleSubmit} className="signup-form">
            <h2 className="form-title">Create Account</h2>

            <input
              type="text"
              placeholder="Username"
              name="username"
              onChange={handleChange}
              value={data.username}
              required
              className="input-field"
            />

            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
              value={data.email}
              required
              className="input-field"
            />

            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
              value={data.password}
              required
              className="input-field"
            />

            <button type="submit" className="btn signup-btn">
              Signup
            </button>
          </form>

          {message && (
            <div className={`message-box ${message.includes("successfully") ? "success" : "error"}`}>
              <p>{message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;