import React from 'react';

const ActionButton = ({ text, onClick }) => {
  return (
    <div style={{ position: 'fixed', top: '20px', right: '100px', zIndex: '9999' }}>
      <button className="action-button" onClick={onClick}>{text}</button>
    </div>
  );
};

export default ActionButton;
