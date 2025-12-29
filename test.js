
// const url = 'https://api.themoviedb.org/3/search/movie?query=Top+Gun:+Maverick' //Space in name replaced by '+'
// const options = {
//   method: 'GET',
//   headers: {
//     'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNmNiNjA5M2QyMmRjYTI1M2YxZDI5YWM0NmFiYzZiYiIsIm5iZiI6MTc2NjY1MjcxOS40OCwic3ViIjoiNjk0Y2ZiMmY2ZTE3ZjI0OWNjMmZiMzkzIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.DgvDh4oGYdRf6kijqnsRf6N3fBmt3WtD7IfKx8OA9OY'
//   }
// }
// const response = await fetch(url, options)
// const data = await response.json()
// console.log(data)
// const posterPath = data.results[0].poster_path
// console.log(posterPath)

// const fullPosterPath = 'https://image.tmdb.org/t/p/original' + posterPath

// console.log(fullPosterPath)




const posterUrl = 'http://www.omdbapi.com/?apikey=1e06bc85&s=' + 'Top%20Gun:%20Maverick'
const response = await fetch(posterUrl)
const data = await response.json()
console.log(data)

//
/*

[{userId: 1,…},…]
0
:
{userId: 1,…}
favFilmPerson
:
"I like Tom Holland as he is a friendly person even outside the movie."
favMovie
:
"I like inside out because it conveys deep messages through cute animation that even my kids can enjoy."
q1
:
"new"
q2
:
"fun"
userId
:
1
1
:
{userId: 2, favMovie: "I like Avengers as it is the greatest superhero movie in the last decade.",…}
favFilmPerson
:
"Tom Cruise who is so cool and professional as always"
favMovie
:
"I like Avengers as it is the greatest superhero movie in the last decade."
q1
:
"new"
q2
:
"inspiring"
userId
:
2
*/




// let posterPathArr = []

// async function myFunction() {

//   const movieResponses = ['Avenger Assemble', 'I like movies', 'Avenger Asssemble', 'I dont like movies!']

//   const filteredMovieResponses = movieResponses.filter((entry, idx) => idx % 2 === 0)
//   const filteredMovieResponsesWithoutSpace = filteredMovieResponses.map(entry => {
//     return entry.trim().replaceAll(" ", "+")
//   })

//   posterPathArr = Promise.all(filteredMovieResponsesWithoutSpace.map(async (entry) => {
//     const posterUrl = 'https://api.themoviedb.org/3/search/movie?query=' + entry
//     const posterOptions = {
//       method: 'GET',
//       headers: {
//         'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNmNiNjA5M2QyMmRjYTI1M2YxZDI5YWM0NmFiYzZiYiIsIm5iZiI6MTc2NjY1MjcxOS40OCwic3ViIjoiNjk0Y2ZiMmY2ZTE3ZjI0OWNjMmZiMzkzIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.DgvDh4oGYdRf6kijqnsRf6N3fBmt3WtD7IfKx8OA9OY'
//       }
//     }

//     const response = await fetch(posterUrl, posterOptions)
//     const data = await response.json()
//     console.log(data)
//     const posterPath = data.results[0].poster_path
//     const fullPosterPath = 'https://image.tmdb.org/t/p/original' + posterPath

//     return fullPosterPath
//   }))

// }

// await myFunction()
// console.log(posterPathArr)
