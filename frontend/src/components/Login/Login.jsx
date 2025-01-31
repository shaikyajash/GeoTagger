// Login.jsx
import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import './Login.css'; // Import the CSS file

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
        localStorage.setItem("token", response.data.token);
        setMessage("Logged in successfully. Redirecting to home...");

        if (response.data.success) {
          setTimeout(() => {
            navigate("/home");
          }, 1000);
        } else {
          setMessage("Invalid credentials. Please try again.");
          setTimeout(() => {
            navigate("/login");
          }, 1000);
        }
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">GeoTagger</h1>
        <form onSubmit={handleSubmit} className="login-form">
          <h2 className="form-title">Login to your account</h2>
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
          <button type="submit" className="btn login-btn">
            Login
          </button>
        </form>

        {message && (
          <div className={`message-box ${message.includes("successfully") ? "success" : "error"}`}>
            <p>{message}</p>
          </div>
        )}
      </div>
      <div className="signup-prompt">
        <h2 className="signup-title">New User?</h2>
        <Link to="/signup">
          <button type="button" className="btn signup-btn">
            Signup
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Login;