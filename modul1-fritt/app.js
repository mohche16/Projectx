// apikey=dcb7b7b4 / #dcb7b7b4 efter index.html i urlen
const apiKey = location.hash.substring(1);
const apiUrl = `https://www.omdbapi.com/?apikey=${apiKey}&t=`;

//Fetch movie name by title
let fetchMovieDataTitle = async (moviename) => {
  let dataMovie = {};
  //Fetch single object movie (not an array)
  await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&t=` + moviename)
    .then((response) => response.json())
    .then((data) => (dataMovie = data));
  return dataMovie;
};

//Fetch 10 random movies
let fetchMovieData = async () => {
  let dataMovie = {};
  //Fetch array of objects (movies)
  await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=movie`)
    .then((response) => response.json())
    .then((data) => (dataMovie = data.Search));
  return dataMovie;
};

//Parse over every array item to insert HTML with proper values.
function parseArrayToMovieList(arraytoparse) {
  let parsedArray = arraytoparse
    .map((index) => {
      return `
        <div class="movie" id=${index.Title}>
        <ul>
          <h3>Movie Title:</h3>
          <h5 id="title">${index.Title}</h5>
          <h3>Year:</h3>
          <h5 id="year">${index.Year}</h5>
          <h3>imdbID:</h3>
          <a href="https://www.imdb.com/title/${index.imdbID}">
            <h5 id="imdbID">${index.imdbID}</h5></a
          >
          <h3>Type:</h3>
          <h5 id="Type">Movie</h5>
          <img
            id="poster"
            src=${index.Poster}
          />
        </ul>
      </div>`;
    })
    .join("");
  return parsedArray;
}

//HTML elements for movie container div and searchbox
const moviesContainerEl = document.querySelector(".movieslist");
const searchboxEl = document.querySelector(".searchbox-movie");

window.onload = async () => {
  //Fetch movies array
  let movieData = await fetchMovieData();
  console.log(movieData);
  //Parse array to include html
  let parsedArray = await parseArrayToMovieList(movieData);
  // set container html to html with all movies loaded.
  moviesContainerEl.innerHTML = parsedArray;
};

let filterMovieName = (array, moviename) => {
  return array.filter((object) =>
    object.Title.toLowerCase().includes(moviename.toLowerCase())
  );
};

searchboxEl.addEventListener("input", async (e) => {
  //our searched movie
  let searchBoxValue = e.target.value;

  //if value is nothing then reset to default movie values.
  if (!searchBoxValue) {
    let movieData = await fetchMovieData();
    let parsedArray = await parseArrayToMovieList(movieData);
    moviesContainerEl.innerHTML = parsedArray;
  } else {
    //Search 10 movie array in case it has our movie
    let movieData10 = await fetchMovieData();
    let filtered_array = filterMovieName(movieData10, searchBoxValue);
    if (filtered_array[0]) {
      if (
        filtered_array[0].Title.toLowerCase().includes(
          searchBoxValue.toLowerCase()
        )
      ) {
        let parsedArray = `
          <div class="movie" id=${filtered_array[0].Title}>
          <ul>
            <h3>Movie Title:</h3>
            <h5 id="title">${filtered_array[0].Title}</h5>
            <h3>Year:</h3>
            <h5 id="year">${filtered_array[0].Year}</h5>
            <h3>imdbID:</h3>
            <a href="https://www.imdb.com/title/${filtered_array[0].imdbID}">
              <h5 id="imdbID">${filtered_array[0].imdbID}</h5></a
            >
            <h3>Type:</h3>
            <h5 id="Type">Movie</h5>
            <img
              id="poster"
              src=${filtered_array[0].Poster}
            />
          </ul>
        </div>`;
        moviesContainerEl.innerHTML = parsedArray;
        console.log("Used local filter");
      }
    }
    if (!filtered_array[0]) {
      //else fetch data and set innerhtml to parsed data with single object (movie searched for)
      let movieData = await fetchMovieDataTitle(searchBoxValue);
      if (movieData.Title) {
        let parsedArray = `
          <div class="movie" id=${movieData.Title}>
          <ul>
            <h3>Movie Title:</h3>
            <h5 id="title">${movieData.Title}</h5>
            <h3>Year:</h3>
            <h5 id="year">${movieData.Year}</h5>
            <h3>imdbID:</h3>
            <a href="https://www.imdb.com/title/${movieData.imdbID}">
              <h5 id="imdbID">${movieData.imdbID}</h5></a
            >
            <h3>Type:</h3>
            <h5 id="Type">Movie</h5>
            <img
              id="poster"
              src=${movieData.Poster}
            />
          </ul>
        </div>`;
        moviesContainerEl.innerHTML = parsedArray;
        console.log("Used fetch filter");
      }
    }
  }
});
