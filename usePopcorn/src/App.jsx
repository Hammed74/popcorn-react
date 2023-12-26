import { useEffect, useState } from "react";
import { tempMovieData, tempWatchedData } from "./tempMovieData";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = '3aff5ea'

export default function App() {
  const [movies, setMovies] = useState(tempMovieData);
    const [watched, setWatched] = useState(tempWatchedData);
    const [isLoading, setIsLoading] = useState(false);
    const [query, setQuery] = useState('');
    const [error, setError] = useState('')
    const [selectedId, setSelectedId] = useState(null)


  useEffect(function(){
      async function getMovieData() {
        try {setIsLoading(true)
          setError('')
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`
        );

        if(!res.ok){
          throw new Error('Something went terribly wrong!')
        }
        const data = await res.json();
        if(data.Response === "False"){
          throw new Error('Movie Not Found')
        }
        setMovies(data.Search)
        setIsLoading(false)
      } catch (err){
        console.error(err.message)
        setError(err.message)
      } finally{
          setIsLoading(false);
      }
    }

    if (query.length < 3){
      setMovies([])
      setError('')
      return
    }


     
      getMovieData()  
  }, [query])

    
  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {isLoading && <p className="loader">Loading...</p>}
          {!isLoading && !error && <MovieList setSelectedId={setSelectedId} movies={movies} />}
          {error && <ErrorMessage message={error} />}
        </Box>

        <Box>
          {selectedId ? (
            <MovieDetail selectedId={selectedId} />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList watched={watched} />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function ErrorMessage({message}){
  return <p className="error">
    <span>☣️</span>{message}
  </p>
}

function Main({children }) {

  return (
    <>
      <main className="main">
     {children}
      </main>
    </>
  );
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedMovieList({ watched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <Movie key={movie.imdbID} movie={movie} />
      ))}
    </ul>
  );
}

function Movie({ movie }) {
  return (
    <li key={movie.imdbID}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
      </div>
    </li>
  );
}

function Box({children}) {
  const[isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && (
        children
      )}
    </div>
  );
}

function MovieList({movies, setSelectedId}) {
  return (
    <ul className="list list-movies">
      {movies.map((movie) => (
        <li onClick={() => setSelectedId(movie.imdbID)} key={movie.imdbID}>
          <img src={movie.Poster} alt={`${movie.Title} poster`} />
          <h3>{movie.Title}</h3>
          <div>
            <p>
              <span>🗓</span>
              <span>{movie.Year}</span>
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

function NavBar({children }) {
  return <nav className="nav-bar">{children}</nav>;
}

function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function Search({query, setQuery}) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

function MovieDetail({selectedId}){
  return <div className="details">{selectedId}</div>
}