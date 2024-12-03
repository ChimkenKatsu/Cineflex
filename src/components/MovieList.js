import React from 'react';
import './MovieList.css';

const MovieList = ({ movies }) => {
    return (
        <div className="movie-list">
            {movies.map((movie) => (
                <div className="movie-item" key={movie.imdbID}>
                    <img src={movie.Poster} alt={movie.Title} />
                    <p>{movie.Title}</p>
                </div>
            ))}
        </div>
    );
};

export default MovieList;
