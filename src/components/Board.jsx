import React, { useState, useEffect } from 'react';
import Cell from './Cell';
import InputPrompt from './InputPrompt';
import './Board.css';

const Board = () => {
  const rows = 5; // Adjust this to change the triangle size
  const totalCells = (rows * (rows + 1)) / 2;
  const [cells, setCells] = useState(Array(totalCells).fill(null));
  const [isRedNext, setIsRedNext] = useState(true);
  const [usedNumbersRed, setUsedNumbersRed] = useState(new Set());
  const [usedNumbersBlue, setUsedNumbersBlue] = useState(new Set());
  const [showPrompt, setShowPrompt] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [winner, setWinner] = useState(null);
  const [startingPlayer, setStartingPlayer] = useState('');

  useEffect(() => {
    const randomPlayer = Math.random() < 0.5 ? 'Red' : 'Blue';
    setStartingPlayer(randomPlayer);
    setIsRedNext(randomPlayer === 'Red');
  }, []);

  const handleClick = (index) => {
    if (cells[index] || cells.filter(cell => cell === null).length === 1) return; // Prevent overwriting cells and filling the last cell
    setCurrentIndex(index);
    setShowPrompt(true);
  };

  const handlePromptSubmit = (userInput) => {
    const number = parseInt(userInput, 10);
    const usedNumbers = isRedNext ? usedNumbersRed : usedNumbersBlue;

    if (isNaN(number) || number < 1 || number > 20 || usedNumbers.has(number)) {
      alert("Invalid input or number already used. Please enter a unique number between 1 and 20.");
      return;
    }

    const newCells = [...cells];
    newCells[currentIndex] = { color: isRedNext ? "red" : "blue", number };
    setCells(newCells);
    setIsRedNext(!isRedNext);

    if (isRedNext) {
      setUsedNumbersRed(new Set([...usedNumbersRed, number]));
    } else {
      setUsedNumbersBlue(new Set([...usedNumbersBlue, number]));
    }

    if (newCells.filter(cell => cell === null).length === 1) {
      calculateWinner(newCells);
    }
  };

  const calculateWinner = (cells) => {
    const lastIndex = cells.findIndex(cell => cell === null);
    const adjacentIndices = getAdjacentIndices(lastIndex);
    const redSum = adjacentIndices.reduce((sum, index) => {
      return cells[index]?.color === 'red' ? sum + cells[index].number : sum;
    }, 0);
    const blueSum = adjacentIndices.reduce((sum, index) => {
      return cells[index]?.color === 'blue' ? sum + cells[index].number : sum;
    }, 0);

    if (redSum > blueSum) {
      setWinner('Red');
    } else if (blueSum > redSum) {
      setWinner('Blue');
    } else {
      setWinner('Tie');
    }
  };

  const getAdjacentIndices = (index) => {
    const adjacent = [];
    const row = Math.floor((Math.sqrt(8 * index + 1) - 1) / 2);
    const col = index - (row * (row + 1)) / 2;

    if (row > 0) {
      if (col > 0) adjacent.push(index - row - 1);
      if (col < row) adjacent.push(index - row);
    }
    if (row < rows - 1) {
      adjacent.push(index + row + 1);
      adjacent.push(index + row + 2);
    }
    if (col > 0) adjacent.push(index - 1);
    if (col < row) adjacent.push(index + 1);

    return adjacent;
  };

  const handleReset = () => {
    setCells(Array(totalCells).fill(null));
    setIsRedNext(true);
    setUsedNumbersRed(new Set());
    setUsedNumbersBlue(new Set());
    setShowPrompt(false);
    setCurrentIndex(null);
    setWinner(null);
    const randomPlayer = Math.random() < 0.5 ? 'Red' : 'Blue';
    setStartingPlayer(randomPlayer);
    setIsRedNext(randomPlayer === 'Red');
  };

  const isGameOver = cells.filter(cell => cell === null).length === 1;

  return (
    <div className="board-container">
      <div className="starting-player">
        <p>{startingPlayer} goes first!</p>
      </div>
      <div className="board">
        {Array.from({ length: rows }).map((_, row) => (
          <div key={row} className="row">
            {Array.from({ length: row + 1 }).map((_, col) => {
              const index = (row * (row + 1)) / 2 + col; // Formula to get index in a triangular array
              return (
                <Cell key={index} value={cells[index]} onClick={() => handleClick(index)} index={index} />
              );
            })}
          </div>
        ))}
      </div>
      {showPrompt && (
        <InputPrompt
          onSubmit={handlePromptSubmit}
          onClose={() => setShowPrompt(false)}
        />
      )}
      {isGameOver && (
        <div className="game-over">
          <p>{winner ? `${winner} wins!` : 'It\'s a tie!'}</p>
          <button className="reset-button" onClick={handleReset}>Reset Game</button>
        </div>
      )}
    </div>
  );
};

export default Board;