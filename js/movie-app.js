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

async function addMovie(title, genre) {
    const newMovie = {title: `${title}`, genre: `${genre}`};
    const url = 'http://localhost:3000/movies'
    const options = {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(newMovie)
    }
    fetch(url, options)
        .then(response => {
            // const movies = response.json()
            console.log(`added ${title}`)
        })
        .catch(error => console.error(error));
}

async function deleteMovie(id) {
    const url = `http://localhost:3000/movies/${id}`
    const options = {
        method: 'DELETE'
    }
    fetch(url, options)
        .then(response => {
            console.log(`deleted`)
        })
        .catch(error => console.error(error));
}

async function updateMovie(title, genre, id) {
    const updatedMovieInfo = {title: `${title}`, genre: `${genre}`};
    const url = `http://localhost:3000/movies/${id}`
    const options = {
        method: 'PATCH',
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(updatedMovieInfo)
    }
    fetch(url, options)
        .then(response => {
            // const movies = response.json()
            console.log(`updated ${title}`)
        })
        .catch(error => console.error(error));

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
    let movies = await getMovies();
    //queries
    const movieCards = document.querySelector(".movie-cards");
    const searchInput = document.querySelector("#search-input");
    const sideMenuToggle = document.querySelector(".logo");
    const sideMenu = document.querySelector(".column.side-menu");
    const submitMovieTitleTextBox = document.querySelector("#submit-movie-title");
    const submitMovieGenre = document.querySelector("#submit-movie-genre");
    const submitMovieBtn = document.querySelector("#submit-movie-btn");
    let allMovieCards;
    const movieCard = document.querySelector('.movie-cards');
    let editForm;

    //FUNCTIONS////////////////
    function renderAllMovieCards() {
        movieCards.innerHTML = "";
        movies.forEach((movie) => {
            movieCards.innerHTML += (`
            <div class="movie-card">
            <h4 class="movie-card-title">${movie.title}</h4>
            <p class="movie-card-genre">${movie.genre}</p>
            <span class="edit-movie">EDIT</span>
            <span class="delete-movie">X</span>
            </div>    
            `)
            allMovieCards = document.querySelectorAll('.movie-card');
        })
    }

    function renderSearchedMovies(movies) {
        console.log('rendering searched movie cards');
        movieCards.innerHTML = "";
        movies.forEach((movie) => {
            movieCards.innerHTML += (`
            <div class="movie-card">
            <p>${movie.title}</p>
            <p>${movie.genre}</p>
            </div>    
            `)
        })
    }

    function searchMovies(keyword) {
        console.log(keyword);
        const searchedMovies = movies.filter((movie) => {
            const movieTitle = movie.title.toLowerCase();
            if (movieTitle.includes(keyword) || movie.title.includes(keyword)) {
                return movie;
            }
            ;
        })
        console.log(searchedMovies);
        renderSearchedMovies(searchedMovies);
    }

    function renderEditForm(card) {
        card.innerHTML += (`
            <div class="edit-form">
            <input type="text" class="edit-title" value="">
            <input type="text" class="edit-genre" value="">
            <button class="edit-submit-btn">OK</button>
            <button class="edit-cancel-btn">CANCEL</button>
            </div>
            `)
        let newTitle = document.querySelector('.edit-title');
        let newGenre = document.querySelector('.edit-genre');

        let editCancel = document.querySelector('.edit-cancel-btn')
            .addEventListener('click', (event) => {
                let form = event.target.parentElement;
                form.remove();
            });

        let editSubmit = document.querySelector('.edit-submit-btn')
            .addEventListener('click', (event) => {
                let currentTitle = event.target.parentElement.parentElement.firstElementChild.innerHTML;
                console.log(currentTitle);
                let movieId = movies.filter((movie) => {
                    return movie.title === currentTitle;
                });
                updateMovie(newTitle.value, newGenre.value, movieId[0].id);
                let form = event.target.parentElement;
                form.remove();
            })
    }

    //EVENTS//////////////
    searchInput.addEventListener('keyup', (event) => {
        searchMovies(searchInput.value);
    })
    sideMenuToggle.addEventListener('mouseover', (e) => {
        sideMenu.style.display = "flex";
        // console.log('click');
    });
    sideMenu.addEventListener('mouseleave', (e) => {
        sideMenu.style.display = "none";
    })
    submitMovieBtn.addEventListener('click', async () => {

        await addMovie(submitMovieTitleTextBox.value, submitMovieGenre.value);
        movies = await getMovies();
        await renderAllMovieCards();
    })
    movieCards.addEventListener('click', async (event) => {
        if (event.target.innerHTML === 'X') {
            let movieTitle = event.target.previousElementSibling.previousElementSibling.previousElementSibling.innerHTML
            let card = event.target.parentElement;
            let movieToDelete = movies.filter((movie) => {
                return movie.title === movieTitle;
            })
            let confirmDelete = confirm(`Delete ${movieTitle}?`);
            if (confirmDelete) {
                await deleteMovie(movieToDelete[0].id)
                    .then(() => {
                        card.remove();
                    })
                alert(`${movieTitle} Deleted!`);
            }
        } else if (event.target.innerHTML === 'EDIT') {
            renderEditForm(event.target.parentElement);
        }
    })


    //RUN ON LOAD//////////////
    console.log(movies);
    renderAllMovieCards();
})();