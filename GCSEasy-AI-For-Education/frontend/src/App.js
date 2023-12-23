import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './components/Register.js';  // Adjust the path as needed
import Login from './components/Login.js';
import Tutor from './components/Tutor.js';
import Planner from './components/Planner.js';
import Option from './components/Option.js';
import EssayChecker from './components/EssayChecker.js';
import './App.css';
function App() {
  return (
    <div className="app">
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/option" element={<Option />} />
        <Route path="/tutor" element={<Tutor />} />
        <Route path="/planner" element={<Planner />} />
        <Route path="/essaychecker" element={<EssayChecker />} />

    </Routes>
      </BrowserRouter>
      
    </div>
  );
}

export default App;
