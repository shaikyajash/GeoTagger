// LandingPage.jsx
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import "./LandingPage.css";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();
  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        navigate("/home");
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <div className="app">
      {/* Navbar */}
      <nav className="navbar">
        <motion.div
          className="logo"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="logo-text">GeoTagger</span>
          <motion.span
            className="logo-emoji"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            🌍
          </motion.span>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="hero-title">Discover and Pin Your World</h1>
          <p className="hero-description">
            Join our map-pinning community to share and explore locations
            effortlessly.
          </p>
          <div className="button-group">
            <motion.button
              className="btn login-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/login")}
            >
              Login
            </motion.button>
            <motion.button
              className="btn signup-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </motion.button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

export default LandingPage;
