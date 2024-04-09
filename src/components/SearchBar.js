// En SearchBar.js
import React, { useState } from 'react';

const SearchBar = ({ handleSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <input className="search-input" style={{textAlign: "center"}} type="text" value={searchTerm} onChange={handleChange} placeholder="Buscar..." />
      <button className="search-button" type="submit">Buscar</button>
    </form>
  );
};

export default SearchBar;
