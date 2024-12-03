import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import MovieList from './components/MovieList';
import MovieListHeading from './components/MovieListHeading';
import MovieDetails from './components/MovieDetails'; // Import MovieDetailsss

const App = () => {
  const [movies, setMovies] = useState({});
  const [searchValue, setSearchValue] = useState('');
  const [categories, setCategories] = useState([
    "Action", "Romance", "Comedy", "Drama", "Thriller", "Horror"
  ]);
  const [selectedMovie, setSelectedMovie] = useState(null); // State for selected movie details
  const [filteredMovies, setFilteredMovies] = useState([]); // State for filtered movies

  const movieRowRef = useRef();

  const getMoviesByCategory = async (category) => {
    const url = `http://www.omdbapi.com/?s=${category}&apikey=263d22d8`;
    const response = await fetch(url);
    const responseJson = await response.json();
    return responseJson.Search || [];
  };

  const getMovieDetails = async (movieId) => {
    const url = `http://www.omdbapi.com/?i=${movieId}&apikey=263d22d8`;
    const response = await fetch(url);
    const responseJson = await response.json();
    setSelectedMovie(responseJson);
  };

  const searchMovies = async () => {
    if (!searchValue) {
      setFilteredMovies([]); // Clear search if empty
      return;
    }

    // Fetch movies by search query
    const url = `http://www.omdbapi.com/?s=${searchValue}&apikey=263d22d8`;
    const response = await fetch(url);
    const responseJson = await response.json();
    const allMovies = responseJson.Search || [];

    // Filter movies that start with the same letter as the search value
    const filtered = allMovies.filter((movie) =>
      movie.Title.toLowerCase().startsWith(searchValue.toLowerCase())
    );
    
    setFilteredMovies(filtered);
  };

  useEffect(() => {
    const fetchMovies = async () => {
      const moviesByCategory = {};
      for (const category of categories) {
        const categoryMovies = await getMoviesByCategory(category);
        moviesByCategory[category] = categoryMovies;
      }
      setMovies(moviesByCategory);
    };
    fetchMovies();
  }, [categories]);

  useEffect(() => {
    searchMovies();
  }, [searchValue]);

  return (
    <div className="container movie-app">
      <div className="row header">
        <div className="logo">Cineflex</div>
        <div className="search-box-container">
          <input
            className="search-box"
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search for movies"
          />
          {searchValue && (
            <button
              className="clear-btn"
              onClick={() => setSearchValue('')}
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Render filtered search results */}
      {filteredMovies.length > 0 && (
        <div className="movie-row">
          {filteredMovies.map((movie) => (
            <div
              className="movie-col"
              key={movie.imdbID}
              onClick={() => getMovieDetails(movie.imdbID)} // Show details on click
            >
              <MovieList movies={[movie]} />
            </div>
          ))}
        </div>
      )}

      {/* Render categories */}
      {categories.map((category) => (
        <div key={category}>
          <div className="row header">
            <MovieListHeading heading={category} />
          </div>
          <div ref={movieRowRef} className="movie-row">
            {movies[category]?.map((movie) => (
              <div
                className="movie-col"
                key={movie.imdbID}
                onClick={() => getMovieDetails(movie.imdbID)} // Show details on click
              >
                <MovieList movies={[movie]} />
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Movie Details Modal */}
      {selectedMovie && (
        <MovieDetails
          movieDetails={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
};

export default App;