// GLOBAL CONSTANTS
const MY_API_KEY = '0dce21e41025b5df140c7122a2a69ba6';
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

form.addEventListener("submit", (event) => {
    event.preventDefault()
    handleFormSubmission()
})

showMoreBtn.addEventListener("click", showMore)
closeBtn.addEventListener("click", closeSearch)

async function getTrending() {

    trendingFlag = true
    searchFlag = false

    let url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${MY_API_KEY}&language=en-US&page=${pageNum}`
    let trendingResponse = await fetch(url)
    let trendingResponseData = await trendingResponse .json()

    displayTrending(trendingResponseData)

}

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

function closeSearch() {
    pageNum = 1
    movieArea.innerHTML = ``
    loadMore = false

    if (!closeBtn.classList.contains('hidden')) {
        closeBtn.classList.add('hidden')
    }

    getTrending()
}

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

function showMore() {
    if (trendingFlag == true && searchFlag == false) {
        loadMore = true
        getTrending()
    } else if (searchFlag == true && trendingFlag == false) {
        loadMore = true
        getResults()
    }
}

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

function handleFormSubmission(evt) {
    pageNum = 1
    movieArea.innerHTML = ``
    loadMore = false
    getResults(evt);
}

scrollUp.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth"
    });
});

window.onload = function () {
    getTrending();
}