import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Login from "../components/Login/Login";
import Signup from "../components/Signup";
import MapComponent from "../components/Map";
import Home from "../components/Main/Home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/home",
    element: <Home />,
  },

  {
    path: "/map",
    element: <MapComponent />,
  },
  {
    path: "*",
    element: <Login />,
  },
]);

export default router;
