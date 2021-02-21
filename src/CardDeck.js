import React, { useState, useEffect } from "react";
import axios from 'axios';
import Card from "./Card";
import "./CardDeck.css";

const CardDeck = () => {
    const [ deckId, setDeckId ] = useState();
    const [ deck, setDeck ] = useState([]);
    const [ autoDraw, setAutoDraw ] = useState(false);
    const [ remainingCards, setRemainingCards ] = useState();

    useEffect(() => {
        async function getDeck() {
            const deck = await axios.get("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1");
            setDeckId(deck.data.deck_id);
        }
        getDeck();
    }, []);

    useEffect(() => {
        if (!autoDraw) {
            console.log("Auto draw is false");
            return;
        } else {
            console.log("autodraw is true");
            const intervalId = setInterval(() => {
                getCard();
            }, 100);
            return () => {clearInterval(intervalId)};
        }
    }, [autoDraw]);

   
    async function getCard() {
        
        if (remainingCards === 0) {
            setAutoDraw(false);
            return;
        }
        const card = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/`);
        setRemainingCards(card.data.remaining);
        console.log("Remaining Cards state: ", remainingCards);
        setDeck((d) => {
            return [...d, card.data.cards[0]];
        });
    }

    const handleClick = async() => {
        if (autoDraw) {
            setAutoDraw(false);
        } else {
            setAutoDraw(true);
        }
    }
    return (
        <>
            <div>
                <button onClick={handleClick}>{autoDraw ? "Stop Drawing" : "Start Drawing"}</button>
            </div>
            <div className="CardDeck">
                {deck.map(c => <Card key={c.code} img={c.image} />)}
            </div>
        </>
    )
}

export default CardDeck;