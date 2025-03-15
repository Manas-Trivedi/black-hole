import React from 'react';

const Cell = ({ value, onClick, index }) => {
  const cellStyle = {
    backgroundColor: value ? value.color : '#333',
  };

  const getLetter = (index) => {
    const letters = 'ABCDEFGHIJKLMNO';
    return letters[index];
  };

  return (
    <button className="cell" onClick={onClick} style={cellStyle}>
      {value ? value.number : getLetter(index)}
    </button>
  );
}

export default Cell;