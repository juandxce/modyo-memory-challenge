import React from "react";
import "../styles/Card.css";

const Card = ({ card, isFlipped, onClick }) => {
  return (
    <div className={`card ${isFlipped ? "flipped" : ""}`} onClick={onClick}>
      <div className="card-inner">
        <div className="card-front">?</div>
        <div className="card-back">
          <img src={card.imageUrl} alt={card.name} />
        </div>
      </div>
    </div>
  );
};

export default Card;
