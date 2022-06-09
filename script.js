// GLOBAL CONSTANTS
const MY_API_KEY = '0dce21e41025b5df140c7122a2a69ba6';

let form = document.querySelector("form")
let movieArea = document.querySelector("#movies-grid")
let showMoreTrendingBtn = document.querySelector("#load-more-movies-trending-btn")
let showMoreSearchBtn = document.querySelector("#load-more-movies-search-btn")
let userInput = document.querySelector("#search-input")
let closeBtn = document.querySelector("#close-search-btn")

let pageNum = 1

let searchKey = ""
let backupSearchKey = ""
let loadMore = false

form.addEventListener("submit", (event) => {
    event.preventDefault()
    handleFormSubmission()
})

showMoreTrendingBtn.addEventListener("click", showMoreTrending)
showMoreSearchBtn.addEventListener("click", showMoreSearch)
closeBtn.addEventListener("click", closeSearch)

async function getTrending() {

    let url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${MY_API_KEY}&language=en-US&page=${pageNum}`
    let trendingResponse = await fetch(url)
    let trendingResponseData = await trendingResponse .json()

    displayTrending(trendingResponseData)

    if (!showMoreSearchBtn.classList.contains('hidden')) {
        showMoreSearchBtn.classList.add('hidden')
    }

    if (showMoreTrendingBtn.classList.contains('hidden')) {
        showMoreTrendingBtn.classList.remove('hidden')
    }
}

function displayTrending(trendingData) {

    data = trendingData

    data.results.forEach(movie => {
        movieArea.innerHTML += `<div class="movie-card"><img class="movie-poster" src=https://image.tmdb.org/t/p/w780${movie.poster_path} alt="${movie.original_title} movie poster" width="312" height="468">
        <p class="movie-votes">${movie.vote_average}</p> <p class="movie-title">${movie.original_title}</p></div>`
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

    if (closeBtn.classList.contains('hidden')) {
        closeBtn.classList.remove('hidden')
    }

    showMoreTrendingBtn.classList.add('hidden')

    if (loadMore) {
        searchKey = backupSearchKey
    } else {
        searchKey = userInput.value
    }

    let url = `https://api.themoviedb.org/3/search/movie?api_key=${MY_API_KEY}&language=en-US&query=${searchKey}&page=${pageNum}`
    let response = await fetch(url)
    let searchData = await response.json()
    console.log(searchData)

    displayResults(searchData)

    if (showMoreSearchBtn.classList.contains('hidden')) {
        showMoreSearchBtn.classList.remove('hidden')
    }

    if (!showMoreTrendingBtn.classList.contains('hidden')) {
        showMoreTrendingBtn.classList.add('hidden')
    }
  }

function displayResults(searchData) {

    data = searchData

    data.results.forEach(movie => {
        movieArea.innerHTML += `<div class="movie-card"><img class="movie-poster" src=https://image.tmdb.org/t/p/w780${movie.poster_path} alt="${movie.original_title} movie poster" width="312" height="468">
        <p class="movie-votes">${movie.vote_average}</p> <p class="movie-title">${movie.original_title}</p></div>`
    });

    backupSearchKey = searchKey
    userInput.value = ""

    pageNum += 1
  }

function showMoreTrending() {
    loadMore = true
    getTrending()
}

function showMoreSearch() {
    loadMore = true
    getResults()
}

function handleFormSubmission(evt) {
    pageNum = 1
    movieArea.innerHTML = ``
    loadMore = false
    showMoreTrendingBtn.classList.add('hidden')
    showMoreSearchBtn.classList.add('hidden')
    getResults(evt);
}

window.onload = function () {
    getTrending();
    console.log("https://api.themoviedb.org/3/configuration?api_key=0dce21e41025b5df140c7122a2a69ba6")
  }