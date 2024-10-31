import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import Navbar from './components/Navbar';

const App = () => {
  const [allMovies, setAllMovies] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const moviesPerPage = 20;

  // Fetch movies from the API
  const fetchMovies = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('https://api.tvmaze.com/shows');
      setAllMovies(response.data);
    } catch (err) {
      setError('Failed to fetch movies');
    } finally {
      setLoading(false);
    }
  };

  // Update the displayed movies based on the page number
  const updateMoviesForPage = (page) => {
    const startIndex = (page - 1) * moviesPerPage;
    const endIndex = startIndex + moviesPerPage;
    setMovies(allMovies.slice(startIndex, endIndex));
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    updateMoviesForPage(page);
  }, [allMovies, page]);

  const totalPages = Math.ceil(allMovies.length / moviesPerPage);

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <div className="App">
      <Navbar/>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="movie-grid">
          {movies.map((movie) => (
            <div className="movie-card" key={movie.id}>
              <img
                src={movie.image ? movie.image.medium : 'default_image_url'}
                alt={movie.name}
              />
              <h3>{movie.name}</h3>
              <p>{movie.premiered ? movie.premiered.split('-')[0] : 'N/A'}</p>
            </div>
          ))}
        </div>
      )}

      <div className="pagination">
        <button onClick={handlePreviousPage} disabled={page === 1}>
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={page >= totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default App;
