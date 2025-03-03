import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import WelcomeScreen from './components/WelcomeScreen.js';
import GameBoard from './components/GameBoard.js';
import './styles/App.css';

const App = () => {
  const [playerName, setPlayerName] = useState('');

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route 
            path="/" 
            element={
              playerName ? (
                <Navigate to="/game" replace />
              ) : (
                <WelcomeScreen onNameSubmit={setPlayerName} />
              )
            } 
          />
          <Route 
            path="/game" 
            element={
              playerName ? (
                <GameBoard playerName={playerName} />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App; 