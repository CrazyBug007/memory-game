import React, { useEffect, useState } from "react";

const MemoryGame = () => {
  const [gridSize, setGridSize] = useState(4);
  const [cards, setCards] = useState();
  const [disabled, setDisabled] = useState(false);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [won, setWon] = useState(false);

  const handleGridSizeChange = (e) => {
    let size = +e.target.value;
    if (size > 1 && size < 10) setGridSize(size);
  };

  const initializeGame = () => {
    const numbers = [...Array(gridSize).keys()].map((number) => number + 1);
    const shuffledCards = [...numbers, ...numbers]
      .sort(() => Math.random() - 0.5)
      .map((number, index) => ({ id: index, number }));
    setCards(shuffledCards);
    setFlipped([]);
    setSolved([]);
    setWon(false);
  };


  const checkMatch =(secondId) => {
    const [firstId] = flipped;
    if(cards[firstId].number === cards[secondId].number) {
      setSolved([...solved, firstId, secondId]);
      setFlipped([]);
      setDisabled(false);
    } else {
      setTimeout(() =>{
        setFlipped([]);
        setDisabled(false);
      },1000)
    }
  }

  const handleClick = (id) => {
    if (disabled || won) return;
    if (flipped.length === 0) {
      setFlipped([id]);
      return;
    }
    if(flipped.length === 1) {
      setDisabled(true);
      if(id !== flipped[0]) {
        setFlipped([...flipped, id]);
        checkMatch(id);
      } else {
        setFlipped([]);
        setDisabled(false);
      }
    }
  };

  const isFlipped = (id) => flipped.includes(id) || isSolved(id);
  const isSolved = (id) => solved.includes(id);

  useEffect(() => {
    initializeGame();
  }, [gridSize]);


  useEffect(() => {
    if(cards && cards.length === solved.length ) { 
      setWon(true);
    }
  },[solved, cards]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Memory Game</h1>
      <div>
        <label htmlFor="gridSize" className="mr-2 mb-3">
          Grid Size:{" "}
        </label>
        <input
          className="border-2 border-gray-300 rounded px-2 py-1 mb-2"
          type="number"
          id="gridSize"
          min="2"
          max="9"
          value={gridSize}
          onChange={handleGridSizeChange}
        />
      </div>
      <div
        className="grid gap-2 mb-2"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, minMax(0, 1fr))`,
          width: `min(100%, ${gridSize * 5.5}rem)`,
        }}
      >
        {cards &&
          cards.map((card) => {
            return (
              <div
                onClick={() => handleClick(card.id)}
                key={card.id}
                className={`aspect-square flex items-center justify-center text-xl font-bold rounded-lg cursor-pointer transition-all duration-300 
                  ${isFlipped(card.id) ? 
                    isSolved(card.id) ? "bg-green-500 text-white" : " bg-blue-500 text-white"
                    : "bg-gray-300  text-gray-400" }`}
              >
                {isFlipped(card.id) ? card.number : "?"}
              </div>
            );
          })}
      </div>
      {won && 
        <div className=" mt-4 text-4xl text-green-600 animate-bounce">
          You Won!!!
        </div>}
      <button onClick={initializeGame} className=" mt-4 px-3 py-2 bg-green-500 text-white rounded hover:bg-green-700">
        {won?"Play Again":"Reset"}
      </button>
    </div>
  );
};

export default MemoryGame;
