import React, { useState } from 'react';
import '../styles/WelcomeScreen.css';

const WelcomeScreen = ({ onNameSubmit }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onNameSubmit(name.trim());
    }
  };

  return (
    <div className="welcome-screen">
      <h1>Welcome to the Game</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          maxLength={20}
          required
        />
        <button type="submit">Start Game</button>
      </form>
    </div>
  );
};

export default WelcomeScreen; 