import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../Reuseable/Loading";

const Home = () => {
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState([]);
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
  }, []);

  const Logout = async () => {
    try {
      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      console.error("Error fetching pins:", error);
    }
  };

  return (
    <div>
      {success ? (
        <div>
          <div>
            <h1>Home</h1>
            <h2>Welcome {user.username}</h2>
            <h3>Email: {user.email}</h3>
          </div>
        </div>
      ) : (
        <div><Loading/></div>
      )}

      <button onClick={Logout}>Logout</button>
      <Link to="/map">Map</Link>
    </div>
  );
};

export default Home;
