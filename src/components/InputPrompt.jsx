import React, { useState, useEffect, useRef } from 'react';
import './InputPrompt.css';

const InputPrompt = ({ onSubmit, onClose }) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleSubmit = () => {
    onSubmit(inputValue);
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="input-prompt-overlay">
      <div className="input-prompt">
        <h2>Enter a number between 1 and 20</h2>
        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          min="1"
          max="20"
          ref={inputRef}
        />
        <div className="input-prompt-buttons">
          <button onClick={handleSubmit}>Submit</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default InputPrompt;