import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/WelcomeScreen.css";

const WelcomeScreen = () => {
  const navigate = useNavigate();
  const [name, setName] = useState(
    () => localStorage.getItem("playerName") || ""
  );

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
    <div className="welcome" role="main">
      <h1 className="welcome__title" role="heading" aria-level="1">
        Welcome to the Game
      </h1>
      <form className="welcome__form" onSubmit={handleSubmit} role="form">
        <input
          className="welcome__input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          maxLength={20}
          required
          role="textbox"
          aria-label="Player name input"
          tabIndex={1}
        />
        <button
          className="welcome__button"
          type="submit"
          role="button"
          aria-label="Start game"
          tabIndex={2}
        >
          Start Game
        </button>
      </form>
    </div>
  );
};

export default WelcomeScreen;
