import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/WelcomeScreen.css";

const WelcomeScreen = () => {
  const [playerName, setPlayerName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedName = localStorage.getItem("playerName");
    if (storedName) {
      navigate("/game");
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!playerName.trim()) {
      setError("Please enter your name");
      return;
    }

    localStorage.setItem("playerName", playerName);

    navigate("/game");
  };

  return (
    <div className="welcome-screen">
      <h1 className="welcome-screen__title">Welcome to Memory Game</h1>
      <form onSubmit={handleSubmit} role="form" className="welcome-screen__form">
        <div className="welcome-screen__input-group">
          <label htmlFor="playerName" className="welcome-screen__label">
            Enter your name:
          </label>
          <input
            id="playerName"
            type="text"
            value={playerName}
            onChange={(e) => {
              setPlayerName(e.target.value);
              setError("");
            }}
            className="welcome-screen__input"
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="welcome__button">
          Start Game
        </button>
      </form>
    </div>
  );
};

export default WelcomeScreen;
