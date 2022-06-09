let form = document.querySelector("form")
let photoArea = document.querySelector("#photo-area")

form.addEventListener("submit", (event) => {
    event.preventDefault()
    handleFormSubmission()
})

async function getTrending() {
    let url = `https://api.themoviedb.org/3/movie/now_playing?api_key=0dce21e41025b5df140c7122a2a69ba6&language=en-US&page=1`
    let response = await fetch(url)
    let responseData = await response.json()
    console.log(responseData)

    displayTrending(responseData)
}

function displayTrending(trendingData) {

    data = trendingData

    data.results.forEach(movie => {
        console.log(movie)
        photoArea.innerHTML += `<img src=https://image.tmdb.org/t/p/w500${movie.poster_path} width="250" height="250">
        <p>${movie.original_title} ${movie.vote_average}</p>`
    });

  }

//async function getResults(evt) {

    //if (loadMore) {
        //searchKey = backupSearchKey
    //} else {
        //searchKey = userInput.value
    //}

    //let url = `http://api.giphy.com/v1/gifs/search?api_key=${MY_API_KEY}&q=${searchKey}&limit=${LIMIT}&rating=${RATING}&offset=${offset}`
    //let url = `https://api.themoviedb.org/3/movie/now_playing?api_key=0dce21e41025b5df140c7122a2a69ba6&language=en-US&page=1`
    //let response = await fetch(url)
    //let responseData = await response.json()

    //console.log(responseData)

    //displayResults(responseData)

    //if (showMoreBtn.classList.contains('hidden')) {
    //    showMoreBtn.classList.remove('hidden')
    //}

  //}

//function handleFormSubmission(evt) {
    //console.log('I was submitted')
    //pageNum = 0
    //photoArea.innerHTML = ``
    //loadMore = false
    //showMoreBtn.classList.add('hidden')
    //getResults(evt);
//}

window.onload = function () {

    getTrending();

    console.log("I'm working")
  }