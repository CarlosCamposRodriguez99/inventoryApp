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
    <form onSubmit={handleSubmit}>
      <input type="text" value={searchTerm} onChange={handleChange} placeholder="Buscar por nombre..." />
      <button type="submit">Buscar</button>
    </form>
  );
};

export default SearchBar;
