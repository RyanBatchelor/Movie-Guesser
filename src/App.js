import React, {useState, useEffect}from 'react'
import ReactDOM from 'react-dom/client';


function App() {
  const[playing, setPlaying] = useState(true)
  const[winner, setWinner] = useState(false)
  const[movieList, setMovieList] = useState()
  const[movieTitle, setMovieTitle] = useState()
  const[moviePoster, setMoviePoster] = useState()
  const[movieReveal, setMovieReveal] = useState()
  const[movieHint, setMovieHint] = useState()
  const[showHint, setShowHint] = useState(false)
  const[zoom, setZoom] = useState(4000)
  const[guess, setGuess] = useState()
  const[numberOfGuesses, setNumberOfGuesses] = useState(0)
  const[guessList, setGuessList] = useState([])
  const url = 'https://api.themoviedb.org/3/trending/movie/day?api_key=09d1e9a7c4bf931a2fcd09b554b1893c'
  
  function checkGuess(e){
    updateGuessList(e)
    if(guess !== undefined){
      if(guess.toLowerCase() === movieTitle.toLowerCase()){
        setWinner(prev=>true)
        setPlaying(prev =>false)
        }
    }
  }
    
  function updateGuessList(e){
    e.preventDefault()
    setNumberOfGuesses(prev => prev + 1)
    setGuessList(prev=>[guess, ...prev])
    document.getElementById("guess-form").reset();
    setGuess()
    adjustPicture()
  }
    
  function newGame(){
    setPlaying(prev=>true)
    setWinner(prev=>false)
    getMovie(movieList)
    setGuess()
    setGuessList(prev => [])
    setNumberOfGuesses(0)
    setZoom(4000)
  }
    
  function getMovie(data){
    const listLength = data.length 
    const choooseMovie = Math.floor(Math.random()*listLength)
    setMoviePoster(prev => data[choooseMovie].backdrop_path)
    setMovieReveal(prev=>data[choooseMovie].poster_path)
    setMovieHint(prev => data[choooseMovie].overview)
    setMovieTitle(prev =>data[choooseMovie].title)
  }
    
  function giveUp(){
    setShowHint(prev=>false)
    setPlaying(prev=>false)
  }
    
  function toggleHint(){
    setShowHint(prev=>!prev)
  }
    
  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(data => {
        getMovie(data.results)
        setMovieList(data.results)
        })
    }, [])
    
  function adjustPicture(){
    setZoom(prev => prev-300<800? 800:prev-300)
  }
  return (
    <div className="App">
      <main>
        <div className="card">
          {playing?
          <div className='content'>
            {!showHint?
            <div className="card-image" style= {{
                    backgroundImage: `url(https://image.tmdb.org/t/p/w500/${moviePoster})`,
                    backgroundRepeat: `no-repeat`,
                    backgroundSize: `${zoom}px ${zoom}px`,
                    }}>
            </div>:

            <div className="card-image hint-display"style= {{
                border: "1px solid black",
                }}>
              <h1>Overview</h1>
              <h3>{movieHint}</h3>
            </div>}



            <div className='hint'>
            {numberOfGuesses>3?<h4 className = "hint-btn" onClick={toggleHint}>Hint?</h4>:""}
            </div>

            <div className = 'number-of-guesses'>
                    <h4>Number of Guesses: {numberOfGuesses}</h4>
                </div>

            <div className='guess-form'>
              <form onSubmit = {checkGuess} id = "guess-form">
                  <div className='form-input'>
                    <label htmlFor = 'guess-input'>Guess: </label>
                    <input type = 'text' className='guess-input-box' name = 'guess-input' onChange = 
                      {(e) => setGuess(e.target.value)} disabled = {!playing}/><br/>
                  </div>
                <div className='form-btn'>
                  <button className = "guess-btn btn" type = 'submit' disabled = {!playing}>Guess</button>
                  <button className = "give-up-btn btn" onClick = {giveUp} disabled = {!playing}>Give up?</button>
                </div>
              </form>

            </div>
            
            <div className = "guess-list">
              <h4>Your Guesses: </h4>
              {guessList.map((data,i)=>(
              <p key = {i} className = "guess-output">{data}</p>
              ))}
            </div>
          </div>:

          <div className="game-over-screen">
          
            <div className = "win-or-lose-msg">
              {winner? 
              <h4>Congrats! You won in {numberOfGuesses} guess{numberOfGuesses===1?"":"es"}</h4>:
              <h4>You gave up after {numberOfGuesses} attempt{numberOfGuesses===1?"":"s"}</h4>}
            </div>
          
            <div className="card-image" style={{
              backgroundImage: `url(https://image.tmdb.org/t/p/w500/${movieReveal})`,
              backgroundRepeat: `no-repeat`,
              backgroundSize: "contain",
              backgroundPosition: "center",
              }}>
            </div>
        
            <div className="movie-title">
              <h4>Movie Title</h4>
              <h2>{movieTitle}</h2>
              <p>{movieHint}</p>
            </div>
            
            <div className="new-game" onClick={newGame}>
              <h3 className="new-game-btn">Play Again?</h3>
            </div>
            
            <div className = "guess-list">
                  <h4>Your Guesses: </h4>
                  {guessList.map((data,i)=>(
                      <p key = {i}>{data}</p>
                  ))}
            </div>
            
          </div>}


	      </div>
      </main>
    </div>
  );
}

export default App;
