let loaderAnim = document.querySelector('.loading');

async function getMovies() {
    loaderAnim.style.display = 'flex';
    try {
        const url = 'http://localhost:3000/movies'
        const options = {
            method: "GET",
            headers: {
                "content-type": "application/json"
            }
        }
        const response = await fetch(url, options);
        const movies = await response.json();
        loaderAnim.style.display = 'none';
        return movies;
    } catch (error) {
        loaderAnim.innerHTML = 'ERROR';
        console.log(error.message);
    }
}
async function addMovie(title, genre) {
    loaderAnim.style.display = 'flex';
    const newMovie = {title: `${title}`, genre: `${genre}`, rating: ""};
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
            loaderAnim.style.display = 'none';
            console.log(`added ${title}`)
        })
        .catch(error => console.error(error));
}
async function deleteMovie(id) {
    loaderAnim.style.display = 'flex';
    const url = `http://localhost:3000/movies/${id}`
    const options = {
        method: 'DELETE'
    }
    fetch(url, options)
        .then(response => {
            loaderAnim.style.display = 'none';
            console.log(`deleted`)
        })
        .catch(error => console.error(error));
}
async function updateMovie(title, genre, rating, id) {
    loaderAnim.style.display = 'flex';
    const updatedMovieInfo = {title: `${title}`, genre: `${genre}`, rating: `${rating}`};
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
            loaderAnim.style.display = 'none';
            console.log(`updated ${title}`)
        })
        .catch(error => console.error(error));

}

(async () => {
    //VARIABLES AND QUERIES///////////////////////
    //variables
    let movies = await getMovies();
    //queries
    const movieCards = document.querySelector(".movie-cards");
    const searchInput = document.querySelector("#search-input");
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
            let movieRating = parseInt(movie.rating);
            let starRating = "";
            for (let i = 0; i < movieRating; i++) {
                starRating += "&starf;"
            }
            movieCards.innerHTML += (`
            <div class="movie-card">
            <div class="movie-card-rating">${starRating}</div>
            <h4 class="movie-card-title">${movie.title}</h4>
            <p class="movie-card-genre">${movie.genre}</p>
            <div class="card-mod">
            <span class="edit-movie">EDIT</span>
            <span class="delete-movie">X</span>
            </div>
            </div>    
            `)
            allMovieCards = document.querySelectorAll('.movie-card');
        })
    }
    function renderSearchedMovies(movies) {
        console.log('rendering searched movie cards');
        movieCards.innerHTML = "";
        movies.forEach((movie) => {
            let movieRating = parseInt(movie.rating);
            let starRating = "";
            for (let i = 0; i < movieRating; i++) {
                starRating += "&starf;"
            }
            movieCards.innerHTML += (`
            <div class="movie-card">
            <div class="movie-card-rating">${starRating}</div>
            <h4 class="movie-card-title">${movie.title}</h4>
            <p class="movie-card-genre">${movie.genre}</p>
            <div class="card-mod">
            <span class="edit-movie">EDIT</span>
            <span class="delete-movie">X</span>
            </div>
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
        let currentTitle = card.parentElement.firstElementChild.nextElementSibling.innerHTML;
        let currentGenre = card.parentElement.firstElementChild.nextElementSibling.nextElementSibling.innerHTML;
        let currentRating = card.parentElement.firstElementChild.innerHTML.split('').length;
        console.log(card);
        card.parentElement.innerHTML += (`
            <div class="edit-form">
            <input type="text" class="text-box edit-title" value="${currentTitle}">
            <select class="text-box edit-genre" id="edit-genre" name="select-new-genre" value="${currentGenre}">
                <option>Action</option>
                    <option value="comedy">Comedy</option>
                    <option value="crime">Crime</option>
                    <option value="thriller">Thriller</option>
                    <option value="romance">Romance</option>
                    <option value="documentary">Documentary</option>
                </select>
            <input type="text" class="text-box edit-rating" value="${currentRating}">
            <button class="edit-submit-btn button">OK</button>
            <button class="edit-cancel-btn button">CANCEL</button>
            </div>
            `)
        let newTitle = document.querySelector('.edit-title');
        let newGenre = document.querySelector('.edit-genre');
        let newRating = document.querySelector('.edit-rating');

        let editCancel = document.querySelector('.edit-cancel-btn')
            .addEventListener('click', (event) => {
                let form = event.target.parentElement;
                form.remove();
            });

        let editSubmit = document.querySelector('.edit-submit-btn')
            .addEventListener('click', (event) => {
                if (isNaN(newRating.value)) {
                    alert('Please Enter a Number');
                } else {
                    console.log(currentTitle);
                    let movieId = movies.filter((movie) => {
                        return movie.title === currentTitle;
                    });
                    console.log(movieId);
                    updateMovie(newTitle.value, newGenre.value, newRating.value, movieId[0].id);
                    let form = event.target.parentElement;
                    form.remove();
                    location.reload();
                }

            })
    }

    //EVENTS//////////////
    searchInput.addEventListener('keyup', (event) => {
        searchMovies(searchInput.value);
    })
    submitMovieBtn.addEventListener('click', async () => {
        if(submitMovieTitleTextBox.value === ""){
            alert('Enter a Title to Submit a Movie!')
        } else if (submitMovieGenre.value === ""){
            alert('Select a Genre!');
        } else {
            await addMovie(submitMovieTitleTextBox.value, submitMovieGenre.value);
            movies = await getMovies();
            await renderAllMovieCards();
        }
        })
    movieCards.addEventListener('click', async (event) => {
        if (event.target.innerHTML === 'X') {
            let movieTitle = event.target.parentElement.parentElement.firstElementChild.nextElementSibling.innerHTML
            let card = event.target.parentElement.parentElement;
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