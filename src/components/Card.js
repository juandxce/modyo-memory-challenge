import React from "react";
import "../styles/Card.css";

const Card = ({ card, isFlipped, onClick, index }) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div 
      className={`card ${isFlipped ? "card--flipped" : ""}`} 
      onClick={onClick}
      onKeyPress={handleKeyPress}
      role="button"
      tabIndex={0}
      aria-pressed={isFlipped}
      aria-label={`Card ${index + 1}${isFlipped ? `, showing ${card.name}` : ', face down'}`}
    >
      <div className="card__inner">
        <div className="card__index">{index + 1}</div>
        <div className="card__face card__face--front">?</div>
        <div className="card__face card__face--back">
          <img className="card__image" src={card.imageUrl} alt={card.name} />
        </div>
      </div>
    </div>
  );
};

export default Card;
