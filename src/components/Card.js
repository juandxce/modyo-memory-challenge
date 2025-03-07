import React from "react";
import "../styles/Card.css";

const Card = ({ card, isFlipped, onClick, index, cardName }) => {
  const handleKeyPress = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };

  const getAriaLabel = () => {
    if (isFlipped) {
      return `Card ${index + 1}, showing ${cardName}`;
    }
    return `Card ${index + 1}, face down. Press Enter or Space to flip`;
  };

  return (
    <div
      className={`card ${isFlipped ? "card--flipped" : ""}`}
      onClick={onClick}
      onKeyPress={handleKeyPress}
      role="button"
      tabIndex={0}
      aria-pressed={isFlipped}
      aria-label={getAriaLabel()}
    >
      <div className="card__inner">
        <div className="card__index">{index + 1}</div>
        <div className="card__face card__face--front" aria-hidden="true">?</div>
        <div className="card__face card__face--back" aria-hidden={!isFlipped}>
          <img className="card__image" src={card.imageUrl} alt={cardName} />
        </div>
      </div>
    </div>
  );
};

export default Card;
