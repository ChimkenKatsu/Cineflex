import React from 'react';
import './MovieDetails.css';

const MovieDetails = ({ movieDetails, onClose }) => {
  if (!movieDetails) return null;

  return (
    <div className="details-overlay">
      <div className="details-content">
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
        <h2>{movieDetails.Title}</h2>
        <p><strong>Release Date:</strong> {movieDetails.Released}</p>
        <p><strong>Plot:</strong> {movieDetails.Plot}</p>
        <p><strong>Genre:</strong> {movieDetails.Genre}</p>
        <p><strong>Director:</strong> {movieDetails.Director}</p>
      </div>
    </div>
  );
};

export default MovieDetails;