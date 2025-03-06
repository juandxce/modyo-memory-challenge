import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/WelcomeScreen.css";

const WelcomeScreen = () => {
  const navigate = useNavigate();
  const [name, setName] = useState(() => localStorage.getItem("playerName") || "");

  useEffect(() => {
    const storedName = localStorage.getItem("playerName");
    if (storedName) {
      navigate("/game");
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      localStorage.setItem("playerName", name.trim());
      navigate("/game");
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
