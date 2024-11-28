import React from 'react';

const SearchBox = (props) => {
  const handleSearchChange = (event) => {
    props.setSearchValue(event.target.value);
  };

  return (
    <div className="search-box-container">
      <input
        className="search-box"
        type="text"
        value={props.value}
        onChange={handleSearchChange}
        placeholder="Search for movies..."
      />
      <button 
        className="clear-btn" 
        onClick={() => props.setSearchValue('')}>
        <span role="img" aria-label="clear">🔎</span>
      </button>
    </div>
  );
};

export default SearchBox;
