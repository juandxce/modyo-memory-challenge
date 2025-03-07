import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "./Card";
import "../styles/GameBoard.css";

const DIFFICULTY_LEVELS = {
  Easy: 6,
  Medium: 9,
  Hard: 18,
};

const initialDifficulty = "Medium";
const WINNING_SOUND = new Audio("/sounds/victory.mp3");
const BACKGROUND_MUSIC = new Audio("/sounds/background-music.mp3");
BACKGROUND_MUSIC.loop = true;

const GameBoard = () => {
  const navigate = useNavigate();
  const playerName = localStorage.getItem("playerName");

  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [errors, setErrors] = useState(0);
  const [matches, setMatches] = useState(0);
  const [loading, setLoading] = useState(true);
  const [difficulty, setDifficulty] = useState(initialDifficulty);
  const [isBackgroundMusicPlaying, setIsBackgroundMusicPlaying] =
    useState(false);
  const [time, setTime] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);
  const [showMessage, setShowMessage] = useState(true);

  useEffect(() => {
    if (!playerName) {
      navigate("/");
    }
  }, [navigate, playerName]);

  useEffect(() => {
    fetchCards();
  }, []);

  useEffect(() => {
    if (matches === DIFFICULTY_LEVELS[difficulty]) {
      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }
      BACKGROUND_MUSIC.pause();
      BACKGROUND_MUSIC.currentTime = 0;
      WINNING_SOUND.play().catch((error) => {
        console.warn("Error playing winning sound:", error);
      });
    }
  }, [matches, difficulty, timerInterval]);

  const handleDifficultyChange = (e) => {
    const newDifficulty = e.target.value;
    setDifficulty(newDifficulty);
  };

  const fetchCards = async () => {
    try {
      const response = await fetch(
        "https://fed-team.modyo.cloud/api/content/spaces/animals/types/game/entries?per_page=20"
      );
      const data = await response.json();

      const shuffledEntries = data.entries.sort(() => Math.random() - 0.5);
      const pairsCount = DIFFICULTY_LEVELS[difficulty];

      const selectedCards = shuffledEntries
        .slice(0, pairsCount)
        .map((entry) => ({
          id: entry.fields.image.uuid,
          imageUrl: entry.fields.image.url,
          name: entry.meta.name,
        }));

      initializeGame(selectedCards);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching cards:", error);
      setLoading(false);
    }
  };

  const initializeGame = (fetchedCards) => {
    const duplicatedCards = [...fetchedCards, ...fetchedCards]
      .sort(() => Math.random() - 0.5)
      .map((card, index) => ({
        ...card,
        uniqueId: `${card.id}-${index}`,
      }));
    setCards(duplicatedCards);
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleCardClick = (clickedCard) => {
    if (!timerInterval) {
      const interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
      setTimerInterval(interval);
    }

    if (!isBackgroundMusicPlaying) {
      BACKGROUND_MUSIC.play().catch((error) => {
        console.warn("Error playing background music:", error);
      });
      setIsBackgroundMusicPlaying(true);
    }

    if (
      flippedCards.length === 2 ||
      matchedCards.includes(clickedCard.uniqueId) ||
      flippedCards.some((card) => card.uniqueId === clickedCard.uniqueId)
    )
      return;

    const newFlippedCards = [...flippedCards, clickedCard];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      if (newFlippedCards[0].id === newFlippedCards[1].id) {
        setMatchedCards([
          ...matchedCards,
          newFlippedCards[0].uniqueId,
          newFlippedCards[1].uniqueId,
        ]);
        setMatches((prev) => prev + 1);
        setFlippedCards([]);
      } else {
        setErrors((prev) => prev + 1);
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const isCardFlipped = (card) => {
    return (
      flippedCards.some((fc) => fc.uniqueId === card.uniqueId) ||
      matchedCards.includes(card.uniqueId)
    );
  };

  const handleRestart = () => {
    setFlippedCards([]);
    setMatchedCards([]);
    setErrors(0);
    setMatches(0);
    setShowMessage(true);
    setIsBackgroundMusicPlaying(false);
    BACKGROUND_MUSIC.pause();
    BACKGROUND_MUSIC.currentTime = 0;
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    setTime(0);
    fetchCards();
  };

  useEffect(() => {
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [timerInterval]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="game" role="main">
      <div className="game__header">
        <h2 className="game__title">Player: {playerName}</h2>
        <div className="game__timer">{formatTime(time)}</div>
        <div className="game__score" role="status" aria-live="polite">
          <div className="game__difficulty">
            <label htmlFor="difficulty">Difficulty: </label>
            <select
              id="difficulty"
              className="game__difficulty-selector"
              value={difficulty}
              onChange={handleDifficultyChange}
              tabIndex={0}
            >
              {Object.keys(DIFFICULTY_LEVELS).map((level) => (
                <option key={level} value={level}>
                  {`${level} (${DIFFICULTY_LEVELS[level] * 2} cards)`}
                </option>
              ))}
            </select>
          </div>
          <button
            className={"game__button"}
            onClick={handleRestart}
            tabIndex={0}
            aria-label="Reset game"
          >
            Reset game
          </button>
          <p className="game__score-text" aria-live="polite">
            Errors: {errors}
          </p>
          <p className="game__score-text" aria-live="polite">
            Matches: {matches}
          </p>
        </div>
      </div>

      <div className="game__grid" role="grid" aria-label="Memory game grid">
        {cards.map((card, index) => (
          <Card
            key={card.uniqueId}
            card={card}
            index={index}
            isFlipped={isCardFlipped(card)}
            onClick={() => handleCardClick(card)}
            cardName={card.name}
          />
        ))}
      </div>

      {matches === DIFFICULTY_LEVELS[difficulty] && showMessage && (
        <div className="game__message" role="alert" aria-live="assertive">
          <button
            className="game__message-close"
            onClick={() => setShowMessage(false)}
            aria-label="Close message"
          >
            ×
          </button>
          Congratulations {playerName}!<br />
          You have completed the memory game in {formatTime(time)}.
        </div>
      )}
    </div>
  );
};

export default GameBoard;
