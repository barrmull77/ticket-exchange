import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './AppRoutes';


import './App.css';

function App() {

  return (
    <div className="App">
        <BrowserRouter>
            <AppRoutes></AppRoutes>
        </BrowserRouter>
    </div>
  );
}

export default App;
