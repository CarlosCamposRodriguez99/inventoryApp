import React from 'react';

const ActionButton = ({ text, onClick }) => {
  return (
    <button onClick={onClick}>{text}</button>
  );
};

export default ActionButton;
