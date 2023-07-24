//AJAX REQUESTS/////////////////////
//AJAX Requests include error handling and loading animation is displayed during request.
//Buttons are disabled during the request, and the user is given feedback on the status of the requests
async function getMovies() {
    const url = 'http://localhost:3000/movies'
    const options = {
        method: "GET",
        headers: {
            "content-type": "application/json"
        }
    }
    const response = await fetch(url, options);
    const movies = await response.json();
    return movies;

}

//DOM Manip/////////////////////////
//HTML is generated with appropriate CSS styles and animations, and provides an engaging and intuitive user experience.

//Movie Management////////////////////
//Editing existing movies is implemented, allowing users to edit their own ratings/reviews of movies. Movie management includes sorting movies by rating, title, or genre, and searching by rating, title or genre

//UX/UI///////////////////////
//Layout and design of application is consistent, intuitive, and well-designed. User feedback is considered and implemented to improve usability.

//Code Quality////////////////////
//Code is optimized for performance and follows accessibility and security best practices. Code is well-documented and includes tests for functionality and edge cases.
(async () => {
    //VARIABLES AND QUERIES///////////////////////
    //variables
    const movies = await getMovies()
    //queries
    const movieCards = document.querySelector(".movie-cards");

    //FUNCTIONS////////////////
    function renderMovieCards(){
        console.log('rendering movie cards');
        movieCards.innerHTML = "";
        movieCards.innerHTML = (`
        <div>
        
</div>
        `)
    }
    //EVENTS//////////////

    //RUN ON LOAD//////////////
    console.log(movies);


})();