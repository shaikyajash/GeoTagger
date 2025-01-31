import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../Reuseable/Loading";
import './Home.css'; // Import the CSS file

const Home = () => {
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://geotagger-cwu7.onrender.com/auth/protected",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setUser(response.data.user);
          setSuccess(true);
        }
      } catch (error) {
        console.error("Error ", error);
        navigate("/login");
      }
    };
    fetchData();
  }, [navigate]);

  const Logout = async () => {
    try {
      localStorage.removeItem("token");
      navigate("/");
    } catch (error) {
      console.error("Error fetching pins:", error);
    }
  }; 

  return (
    <div className="home-container">
      {success ? (
        <div className="user-info-box">
          <div className="user-details">
            <h1 className="home-title">Home</h1>
            <h2 className="welcome-message">Welcome, {user.username}!</h2>
            <h3 className="user-email">Email: {user.email}</h3>
          </div>
          <div className="actions">
            <button onClick={Logout} className="btn logout-btn">
              Logout
            </button>
            <Link to="/map" className="btn map-link">
              Go to Map
            </Link>
          </div>
        </div>
      ) : (
        <div className="loading"><Loading /></div>
      )}
    </div>
  );
};

export default Home;