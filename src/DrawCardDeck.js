import React, { useEffect, useState, useRef } from "react";
import Card from "./Card";
import axios from "axios";
import { v4 as uuid } from "uuid";
import "./DrawCardDeck.css";

const DrawCardDeck = () => {
  const [deck, setDeck] = useState({});
  const [cards, setCards] = useState([]);
  const [drawing, setDrawing] = useState(false);
  const timerId = useRef();

  if (drawing === true && deck.remaining === 0) {
    setDrawing(false);
    alert("Error: no cards remaining!");
  }
  // get deck of cards
  useEffect(function fetchDeckOnce() {
    async function fetchDeck() {
      const deckResults = await axios.get(
        "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
      );
      setDeck(deckResults.data);
    }
    fetchDeck();
  }, []);

  // set timer for drawing card
  useEffect(
    function setCounter() {
      if (drawing === true) {
        timerId.current = setInterval(async () => {
          await drawCard();
        }, 1000);
      }

      return function cleanUpClearTimer() {
        clearInterval(timerId.current);
      };
    },
    [drawing]
  );

  // draw card
  async function drawCard() {
    if (deck.remaining === 0) {
      alert("Error: no cards remaining!");
      return;
    }
    const cardResults = await axios.get(
      `https://deckofcardsapi.com/api/deck/${deck.deck_id}/draw/?count=1`
    );
    setDeck({ ...deck, remaining: cardResults.data.remaining });
    addCard(cardResults.data.cards[0]);
  }
  console.log(deck);

  // put cards on page
  const renderCards = () => {
    return (
      <div className="CardHolder">
        {cards.map((card) => (
          <Card key={card.id} code={card.code} img={card.image} />
        ))}
      </div>
    );
  };

  // update set cards to add new card
  const addCard = (card) => {
    const newCard = { ...card, id: uuid() };
    setCards([...cards, newCard]);
    console.log(cards);
  };

  const keepDrawing = () => {
    if (drawing === false) {
      setDrawing(true);
    } else {
      setDrawing(false);
    }
  };

  return (
    <>
      <button onClick={drawCard}>draw card</button>
      <button onClick={keepDrawing}>
        {drawing === false ? "keep drawing" : "stop"}
      </button>
      {renderCards()}
    </>
  );
};

export default DrawCardDeck;
