

const nextBtn = document.getElementById('next-btn')
const lastBtn = document.getElementById('last-btn')

let movieResponses = ''
let movieList = []
let currentPageCount = 0

document.getElementById('home-btn').addEventListener('click', function () {
    window.location.href = './index.html'
})

nextBtn.addEventListener('click', function () {
    currentPageCount++
    renderPage(currentPageCount)
})

lastBtn.addEventListener('click', function () {
    currentPageCount--
    renderPage(currentPageCount)
})

document.getElementById('poster-img').addEventListener('error', function (event) {
    event.target.src = './images/placeholder.png'
})

await findMovie()

async function findMovie() {
    disableBtn(nextBtn, true)
    disableBtn(lastBtn, true)

    const { hourCount, minuteCount } = JSON.parse(localStorage.getItem('metadata'))
    const userPreferenceArr = JSON.parse(localStorage.getItem('saveResult'))

    // Create query embedding
    let query = `Time Available: ${hourCount} hours ${minuteCount} minutes \n`

    userPreferenceArr.forEach(userPreference => {
        const { userId, favMovie, q1, q2, favFilmPerson } = userPreference
        query += `User: ${userId} | Favorite Movie and reasons: ${favMovie} | Favorite Film Person and reasons: ${favFilmPerson} | Interested in: ${q1} and ${q2} movies \n`
    })

    //  Get relevant context
    const contextUrl = 'https://movie-recommender-worker.cloudflare-demo-wengti.workers.dev/'
    const contextOptions = {
        method: 'POST',
        body: JSON.stringify({
            action: 'getContext',
            query: query,
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const contextResponse = await fetch(contextUrl, contextOptions)
    const contextData = await contextResponse.json()

    if (!contextResponse.ok) {
        throw new Error(`Worker Error: ${contextData.errorMsg}`)
    }

    const { contextArr } = contextData






    // Feed context into the AI - to suggest 3 relevant movies
    const instructions = `
    You are a movie expert. Help the users to pick a few movies to watch based on their preferences.
    You will be given 2 information - Context and Query.
    The Context consists of information that are highly relevant to the user's Query. 
    
    
    The Query are in the following format:
    Available time: _ hours _ minutes
    User: 1 | Favorite Movie and reasons: _ | Favorite Film Person and reasons: _ | Interested in: <genres of movie> movies
    ...
    User: N | Favorite Movie and reasons: _ | Favorite Film Person and reasons: _ | Interested in: <genres of movie> movies
    

    Please pick movie recommendations by only referring to the provided context and user's Query
    The answer format should be as following:
    <movie_name1>#<Recommendation reason for movie_name1>#<movie_name2>#<Recommendation reason for movie_name2>#<movie_name3>#<Recommendation reason for movie_name3>

    Do not put # after the recommendation reason for the final movie.
    You may recommend as many movies as you deem is relevant based on the context and query.
    The recommendation reason should detail why the movie is recommended based on one of the user's preference provided in query.
    Please also ensure that the suggested movies are within user's availale time.

    An example:
    Context: 
    The Prestige: 2006 | PG-13 | 2h 10m | 8.5 rating, Interstellar: 2014 | PG-13 | 2h 49m | 8.7 rating, biographical drama film about the story of American scientist J. Robert Oppenheimer,


    Query:
    Available time: 3 hours 0 minutes
    User: 1 | Favorite Movie and reasons: Inception because of its mind-bending plot | Favorite Film Person and reasons: Christopher Nolan for complex narratives | Interested in: science fiction movies
    User: 2 | Favorite Movie and reasons: Toy Story because of its emotional storytelling | Favorite Film Person and reasons: _ | Interested in: animation movies


    Your response:
    The Prestige#A Christopher Nolan film with intricate storytelling similar to Inception, aligning with User 1’s preference for complex narratives and fitting within the 3-hour time limit#Interstellar#A science fiction film known for ambitious concepts and emotional depth that matches User 1’s genre interest and remains within the available time#Inside Out#An animated film focused on emotional storytelling, which aligns with User 2’s preference and fits comfortably within the time constraint#Finding Nemo#A family-oriented animated adventure that matches User 2’s interest in animation and stays within the available viewing time
`

    const context = contextArr.map(entry => entry.content).join(', ')
    const input = `Context: \n${context}\n\n Query: \n${query}`

    console.log(input)

    const elaborationUrl = 'https://movie-recommender-worker.cloudflare-demo-wengti.workers.dev/'
    const elaborationOptions = {
        method: 'POST',
        body: JSON.stringify({
            action: 'getElaboration',
            instructions: instructions,
            input: input
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const elaborationResponse = await fetch(elaborationUrl, elaborationOptions)
    const elaborationData = await elaborationResponse.json()

    if (!elaborationResponse.ok) {
        throw new Error(`Worker Error: ${elaborationData.errorMsg}`)
    }

    const { responseByAi } = elaborationData




    movieResponses = responseByAi.output_text.split('#')
    await createMovieList(movieResponses)
    renderPage(currentPageCount)
}


async function createMovieList(movieResponses) {

    disableBtn(nextBtn, true)
    disableBtn(lastBtn, true)

    const filteredMovieResponses = movieResponses.filter((entry, idx) => idx % 2 === 0)
    const posterPathArr = await Promise.all(filteredMovieResponses.map(async (entry) => {
        const movieName = entry.trim().replaceAll(" ", "%20")
        const posterUrl = 'https://www.omdbapi.com/?apikey=1e06bc85&s=' + movieName
        const response = await fetch(posterUrl)
        const data = await response.json()
        if (data.Response === 'False') {
            return null
        }
        else {
            console.log(data.Search[0].Poster)
            return data.Search[0].Poster
        }
    }))



    for (let i = 0; i < movieResponses.length; i += 2) {
        if ((i + 1) % 2 === 0) {
            continue
        } //Skip odd number element as it consists of movie reasons

        movieList.push({
            movieName: movieResponses[i],
            recommendationReason: movieResponses[i + 1],
            poster: posterPathArr[i / 2]
        })
    }

    console.log(movieList)



}

// Display the result
function renderPage(pageCount) {
    disableBtn(nextBtn, true)
    disableBtn(lastBtn, true)

    const { movieName, recommendationReason, poster } = movieList[pageCount]
    document.getElementById('poster-title').textContent = movieName
    document.getElementById('poster-img').src = poster
    document.getElementById('movie-description').textContent = recommendationReason


    if (movieList.length === 1){
        disableBtn(nextBtn, true)
        disableBtn(lastBtn, true)
    } else {
        if (pageCount === 0){
            disableBtn(nextBtn, false)
        } else if (pageCount === movieList.length - 1){
            disableBtn(lastBtn, false)
        }
        else {
            disableBtn(nextBtn, false)
            disableBtn(lastBtn, false)
        }
    }
}


function disableBtn(btn, isDisabled) {
    btn.disabled = isDisabled
    if (isDisabled) {
        btn.classList.add('disabled-class')
    } else {
        btn.classList.remove('disabled-class')
    }
}