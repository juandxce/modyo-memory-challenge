import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomeScreen from "./components/WelcomeScreen.js";
import GameBoard from "./components/GameBoard.js";
import "./styles/App.css";

const App = () => {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<WelcomeScreen />} />
          <Route path="/game" element={<GameBoard />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App; 