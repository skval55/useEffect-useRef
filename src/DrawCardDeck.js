import React, { useEffect, useState } from "react";
import Card from "./Card";
import axios from "axios";
import { v4 as uuid } from "uuid";

const DrawCardDeck = () => {
  const [deck, setDeck] = useState({});
  const [cards, setCards] = useState([]);
  const cardUrl =
    "https://deckofcardsapi.com/api/deck/<<deck_id>>/draw/?count=1";
  useEffect(function fetchDeckOnce() {
    async function fetchDeck() {
      const deckResults = await axios.get(
        "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
      );
      setDeck(deckResults);
    }
    fetchDeck();
  }, []);
  useEffect(function fetchCard() {
    async function drawCard() {
      const cardResults = await axios.get(
        `https://deckofcardsapi.com/api/deck/${deck.deck_id}/draw/?count=1`
      );
      addCard(cardResults.cards[0]);
    }
  });
  console.log(deck);

  const renderCards = () => {
    return (
      <div>
        {cards.map((card) => {
          <Card key={card.id} deckId={deck.deck_id} />;
        })}
      </div>
    );
  };

  const addCard = (card) => {
    const newCard = { ...card, id: uuid() };
    setCards = [...cards, newCard];
  };

  return (
    <>
      <button>draw card</button>
      {renderCards()}
    </>
  );
};

export default DrawCardDeck;
