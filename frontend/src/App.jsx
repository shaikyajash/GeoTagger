import React, { useEffect, useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Main from './components/Main/Main';
import Signup from './components/Signup';
import Login from './components/Login/Login';
import Map from './components/Map';



const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser({ token });
    }
  });


  return (
    <Routes>
      {/* Rendering Main only if user is authenticated */}
      {user&&<Route path="/" element={<Main />} />}
      
      {/* Other routes */}
      <Route path="/map" element={<Map />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Login/>} />
    </Routes>
  );
};

export default App;
