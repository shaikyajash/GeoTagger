import React, { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './services/Routes';

const App = () => {
  

  return (
    <div>
      <RouterProvider router={router} />  
    </div>
  );
};

export default App;