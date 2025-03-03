import React, { useState, useEffect } from 'react';
import Card from './Card';
import '../styles/GameBoard.css';

const GameBoard = ({ playerName }) => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [errors, setErrors] = useState(0);
  const [matches, setMatches] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const response = await fetch('https://fed-team.modyo.cloud/api/content/spaces/animals/types/game/entries?per_page=20');
      const data = await response.json();

      const cards = data.entries.slice(0, 9).map(entry => ({
        id: entry.fields.image.uuid,
        imageUrl: entry.fields.image.url,
        name: entry.fields.name || 'Card'
      }));

      initializeGame(cards);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cards:', error);
      setLoading(false);
    }
  };

  const initializeGame = (fetchedCards) => {
    const duplicatedCards = [...fetchedCards, ...fetchedCards]
      .sort(() => Math.random() - 0.5)
      .map((card, index) => ({
        ...card,
        uniqueId: `${card.id}-${index}`
      }));
    setCards(duplicatedCards);
  };

  const handleCardClick = (clickedCard) => {
    if (flippedCards.length === 2 || matchedCards.includes(clickedCard.uniqueId)) return;

    const newFlippedCards = [...flippedCards, clickedCard];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      if (newFlippedCards[0].id === newFlippedCards[1].id) {
        setMatchedCards([...matchedCards, newFlippedCards[0].uniqueId, newFlippedCards[1].uniqueId]);
        setMatches(prev => prev + 1);
        setFlippedCards([]);
      } else {
        setErrors(prev => prev + 1);
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const isCardFlipped = (card) => {
    return flippedCards.some(fc => fc.uniqueId === card.uniqueId) || 
           matchedCards.includes(card.uniqueId);
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="game-board">
      <div className="game-header">
        <h2>Jugador: {playerName}</h2>
        <div className="score-info">
          <p>Errores: {errors}</p>
          <p>Aciertos: {matches}</p>
        </div>
      </div>
      
      <div className="cards-container">
        {cards.map(card => (
          <Card
            key={card.uniqueId}
            card={card}
            isFlipped={isCardFlipped(card)}
            onClick={() => handleCardClick(card)}
          />
        ))}
      </div>

      {matches === 8 && (
        <div className="win-message">
          ¡Felicitaciones {playerName}! Has completado el juego.
        </div>
      )}
    </div>
  );
};

export default GameBoard; 