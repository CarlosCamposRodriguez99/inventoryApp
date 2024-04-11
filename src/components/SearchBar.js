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
      <input className="search-input" type="text" value={searchTerm} onChange={handleChange} placeholder="Buscar..." />
      <button className="search-button" type="submit"><img src="/img/search.svg" alt='search' width="20px" height="15px" /></button>
    </form>
  );
};

export default SearchBar;
