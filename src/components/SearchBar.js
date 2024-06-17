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
      <div className="search-input-wrapper">
        <i className="bi bi-search"></i>
        <input 
          className="search-input" 
          type="text" 
          value={searchTerm} 
          onChange={handleChange} 
          placeholder="Buscar..." 
        />
      </div>
    </form>
  );
};

export default SearchBar;