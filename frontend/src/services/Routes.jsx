import React from "react";
import { createBrowserRouter } from 'react-router-dom';
import Login from "../components/Login/Login";
import Signup from "../components/Signup";
import Main from "../components/Main/Main";
import MapComponent from "../components/Map";

const router = createBrowserRouter(
    [
        {
            path:'/',
            element: <Login/>,
        },
        {
            path:'/login',
            element: <Login />,
        },
        {
            path:'/signup',
            element: <Signup />,
        },
        {
            path:'/main',
            element:<Main />,

        },
       
        {
            path:'/map',
            element:<MapComponent />
        },
        {
            path:'*',
            element:<Login/>,
        }
    ]
)

export default router;