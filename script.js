// GLOBAL CONSTANTS
const MY_API_KEY =;
const scrollUp = document.getElementById("scroll-up");

let form = document.querySelector("form")
let movieArea = document.querySelector("#movies-grid")
let showMoreBtn = document.querySelector("#load-more-movies-btn")
let userInput = document.querySelector("#search-input")
let closeBtn = document.querySelector("#close-search-btn")
let modalContent = document.querySelector("#modal-content")

let trendingFlag = false
let searchFlag = false 

let pageNum = 1

let searchKey = ""
let backupSearchKey = ""
let loadMore = false

// EventListeners

form.addEventListener("submit", (event) => {
    event.preventDefault()
    handleFormSubmission()
})

showMoreBtn.addEventListener("click", showMore)
closeBtn.addEventListener("click", closeSearch)

scrollUp.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth"
    });
});

/* This function makes a call to API to get what's currently trending and 
   calls the displayTrending function to display the trending content */
async function getTrending() {

    trendingFlag = true
    searchFlag = false

    let url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${MY_API_KEY}&language=en-US&page=${pageNum}`
    let trendingResponse = await fetch(url)
    let trendingResponseData = await trendingResponse .json()

    displayTrending(trendingResponseData)

}

/* This function displays the trending data. It takes the JSON received from the API as a parameter and injects
   that data into index.html file */
function displayTrending(trendingData) {

    data = trendingData

    data.results.forEach(movie => {
        if (movie.poster_path == null) {
            movieArea.innerHTML += `<div class="movie-card"><img class="movie-poster" src="images/poster-not-found.png" alt="Placeholder image for ${movie.title} movie poster" onclick="showPopUp(${movie.id})"width="312" height="468">
        <div class="movie-info"><p class="movie-title">${movie.title}</p><p class="movie-votes">&#11088; ${movie.vote_average}</p></div></div>`
        } else {
            movieArea.innerHTML += `<div class="movie-card"><img class="movie-poster" src=https://image.tmdb.org/t/p/w780${movie.poster_path} alt="${movie.title} movie poster" onclick="showPopUp(${movie.id})" width="312" height="468">
            <div class="movie-info"><p class="movie-title">${movie.title}</p><p class="movie-votes">&#11088; ${movie.vote_average}</p></div></div>`
        }
    });

    pageNum += 1
}

// This function exits the search, clears results, and shows the trending movies
function closeSearch() {
    pageNum = 1
    movieArea.innerHTML = ``
    loadMore = false

    if (!closeBtn.classList.contains('hidden')) {
        closeBtn.classList.add('hidden')
    }

    getTrending()
}

/* This function makes a call to API to get what the user searches for and 
   calls the displayResults function to display the search content */
async function getResults(evt) {

    searchFlag = true
    trendingFlag = false

    if (closeBtn.classList.contains('hidden')) {
        closeBtn.classList.remove('hidden')
    }

    if (loadMore) {
        searchKey = backupSearchKey
    } else {
        searchKey = userInput.value
    }

    let url = `https://api.themoviedb.org/3/search/movie?api_key=${MY_API_KEY}&language=en-US&query=${searchKey}&page=${pageNum}`
    let response = await fetch(url)
    let searchData = await response.json()

    displayResults(searchData)

}

/* This function displays the search data. It takes the JSON received from the API as a parameter and injects
   that data into index.html file */
function displayResults(searchData) {

    data = searchData

    data.results.forEach(movie => {
        if (movie.poster_path == null) {
            movieArea.innerHTML += `<div class="movie-card"><img class="movie-poster" src="images/poster-not-found.png" alt="Placeholder image for ${movie.title} movie poster" onclick="showPopUp(${movie.id})" width="312" height="468">
        <div class="movie-info"><p class="movie-title">${movie.title}</p><p class="movie-votes">&#11088;${movie.vote_average}</p></div></div>`
        } else {
            movieArea.innerHTML += `<div class="movie-card"><img class="movie-poster" src=https://image.tmdb.org/t/p/w780${movie.poster_path} alt="${movie.title} movie poster" onclick="showPopUp(${movie.id})" width="312" height="468">
            <div class="movie-info"><p class="movie-title">${movie.title}</p><p class="movie-votes">&#11088;${movie.vote_average}</p></div></div>`
        }
    });

    backupSearchKey = searchKey
    userInput.value = ""

    pageNum += 1
}

/* This function adds show more movies functionality. If the user is on the trending page, the getTrending() 
   will be called to get more trending movies. If the user is on a search page, the getResults() will be
   called to get more movies relating what the user searched for. */
function showMore() {
    if (trendingFlag == true && searchFlag == false) {
        loadMore = true
        getTrending()
    } else if (searchFlag == true && trendingFlag == false) {
        loadMore = true
        getResults()
    }
}

/* This function handles the popup window when a user clicks on a movie poster. It takes the movie id as a
   parameter and makes two API calls to get the movie details and videos associated with that movie. It then 
   injects that information into the index.html file and then clears the information when the users clicks off 
   the popup. */
async function showPopUp(movie_id) {
   
   let detailUrl = `https://api.themoviedb.org/3/movie/${movie_id}?api_key=${MY_API_KEY}&language=en-US`
   let movieDetailResponse = await fetch(detailUrl)
   let movieDetailResponseData = await movieDetailResponse.json()

   let videoUrl = `https://api.themoviedb.org/3/movie/${movie_id}/videos?api_key=${MY_API_KEY}&language=en-US`
   let movieVideoResponse = await fetch(videoUrl)
   let movieVideoResponseData = await movieVideoResponse.json()

   let modal = document.getElementById("moviePopUp");
   let span = document.getElementsByClassName("close")[0];
   modal.style.display = "block";

   span.onclick = function() {
    modal.style.display = "none";
    modalContent.innerHTML = ""
  }

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
      modalContent.innerHTML = ""
    }
  }

  modalContent.innerHTML += `<iframe width="420" height="315"
  src="https://www.youtube.com/embed/${movieVideoResponseData.results[0].key}">
  </iframe>
  <p>Title: ${movieDetailResponseData.title} | Release Date: ${movieDetailResponseData.release_date} | Viewer Rating: ${movieDetailResponseData.vote_average}/10 | Homepage: <a href="${movieDetailResponseData.homepage}">${movieDetailResponseData.homepage}</a></p><p>${movieDetailResponseData.overview}</p>`
}

// This function is called when the user submits the form
function handleFormSubmission(evt) {
    pageNum = 1
    movieArea.innerHTML = ``
    loadMore = false
    getResults(evt);
}

// Displays what's trending on page load
window.onload = function () {
    getTrending();
}
