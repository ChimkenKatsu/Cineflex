import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import MovieList from './components/MovieList';
import MovieListHeading from './components/MovieListHeading';
import SearchBox from './components/SearchBox';
import AddFavourites from './components/AddFavourites';
import RemoveFavourites from './components/RemoveFavourites';

const App = () => {
  const [movies, setMovies] = useState({});
  const [favourites, setFavourites] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [categories, setCategories] = useState([
    "Action", "Romance", "Comedy", "Drama", "Thriller", "Horror"
  ]);

  const movieRowRef = useRef();

  // Fetch movies by category
  const getMoviesByCategory = async (category) => {
    const url = `http://www.omdbapi.com/?s=${category}&apikey=263d22d8`;

    const response = await fetch(url);
    const responseJson = await response.json();

    if (responseJson.Search) {
      return responseJson.Search;
    }
    return [];
  };

  // Fetch and filter movies when component mounts or searchValue changes
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

  // Filter movies based on searchValue
  useEffect(() => {
    const filterMovies = () => {
      const filteredMovies = {};
      for (const category in movies) {
        filteredMovies[category] = movies[category].filter(movie =>
          movie.Title.toLowerCase().includes(searchValue.toLowerCase())
        );
      }
      setMovies(filteredMovies);
    };

    if (searchValue) {
      filterMovies();
    } else {
      // If no search query, fetch and show all movies
      const fetchMovies = async () => {
        const moviesByCategory = {};

        for (const category of categories) {
          const categoryMovies = await getMoviesByCategory(category);
          moviesByCategory[category] = categoryMovies;
        }

        setMovies(moviesByCategory);
      };

      fetchMovies();
    }
  }, [searchValue, movies, categories]);

  // Fetch favourite movies from localStorage
  useEffect(() => {
    const movieFavourites = JSON.parse(localStorage.getItem('react-movie-app-favourites'));
    if (movieFavourites) {
      setFavourites(movieFavourites);
    }
  }, []);

  // Save favourites to localStorage
  const saveToLocalStorage = (items) => {
    localStorage.setItem('react-movie-app-favourites', JSON.stringify(items));
  };

  // Add a movie to favourites
  const addFavouriteMovie = (movie) => {
    const newFavouriteList = [...favourites, movie];
    setFavourites(newFavouriteList);
    saveToLocalStorage(newFavouriteList);
  };

  // Remove a movie from favourites
  const removeFavouriteMovie = (movie) => {
    const newFavouriteList = favourites.filter((favourite) => favourite.imdbID !== movie.imdbID);
    setFavourites(newFavouriteList);
    saveToLocalStorage(newFavouriteList);
  };

  // Handle touch events for swipeable functionality
  const handleTouchStart = (e) => {
    const movieRow = movieRowRef.current;
    const touchStartX = e.touches[0].clientX;
    const scrollStartX = movieRow.scrollLeft;

    const handleTouchMove = (e) => {
      const touchMoveX = e.touches[0].clientX;
      const deltaX = touchStartX - touchMoveX;
      movieRow.scrollLeft = scrollStartX + deltaX;
    };

    const handleTouchEnd = () => {
      movieRow.removeEventListener('touchmove', handleTouchMove);
      movieRow.removeEventListener('touchend', handleTouchEnd);
    };

    movieRow.addEventListener('touchmove', handleTouchMove);
    movieRow.addEventListener('touchend', handleTouchEnd);
  };

  // Handle mouse events for desktop drag functionality
  const handleMouseDown = (e) => {
    const movieRow = movieRowRef.current;
    movieRow.style.cursor = 'grabbing';
    const startX = e.clientX;
    const scrollLeft = movieRow.scrollLeft;

    const handleMouseMove = (e) => {
      const x = e.clientX - startX;
      movieRow.scrollLeft = scrollLeft - x;
    };

    const handleMouseUp = () => {
      movieRow.style.cursor = 'grab';
      movieRow.removeEventListener('mousemove', handleMouseMove);
      movieRow.removeEventListener('mouseup', handleMouseUp);
    };

    movieRow.addEventListener('mousemove', handleMouseMove);
    movieRow.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="container movie-app">
      <div className="row header">
        <MovieListHeading heading="Movies" />
        <SearchBox searchValue={searchValue} setSearchValue={setSearchValue} />
      </div>

      {/* Display movies by category */}
      {categories.map((category) => (
        <div key={category}>
          <div className="row header">
            <MovieListHeading heading={category} />
          </div>

          {/* Swipeable row for each category */}
          <div
            ref={movieRowRef}
            className="movie-row"
            onTouchStart={handleTouchStart} // Enable touch swipe
            onMouseDown={handleMouseDown} // Enable mouse drag
          >
            {movies[category] && movies[category].map((movie) => (
              <div className="movie-col" key={movie.imdbID}>
                <MovieList
                  movies={[movie]} // Display each movie as an array
                  handleFavouritesClick={addFavouriteMovie}
                  favouriteComponent={AddFavourites}
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Display favourites */}
      <div className="row header">
        <MovieListHeading heading="Favourites" />
      </div>
      <div className="movie-row">
        {favourites.map((movie) => (
          <div className="movie-col" key={movie.imdbID}>
            <MovieList
              movies={[movie]} // Display each favourite movie one per row
              handleFavouritesClick={removeFavouriteMovie}
              favouriteComponent={RemoveFavourites}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
