import React from "react";
import { Navigate } from "react-router-dom";

const Redirector = ({ children }) => {
  const token = localStorage.getItem("token");
  
  if (!token) {
    console.log("No token found, redirecting to login...");
    return <Navigate to="/login" />;
  }

  return children;
};

export default Redirector;
