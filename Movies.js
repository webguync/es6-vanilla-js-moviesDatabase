// Movie Class: Represents a Movie
class Movie {
  constructor(title, director, genre, year) {
    this.title = title;
    this.director = director;
    this.genre = genre;
     this.year = year;
  }
}

// UI Class: Handle UI Tasks
class UI {
  static displayMovies() {
    const movies = Store.getMovies();

    movies.forEach((movie) => UI.addMovieToList(movie));
  }

  static addMovieToList(movie) {
    const list = document.querySelector('#movie-list');

    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${movie.title}</td>
      <td>${movie.director}</td>
      <td>${movie.genre}</td>
      <td>${movie.year}</td>
      <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
    `;

    list.appendChild(row);
  }

  static deleteMovie(el) {
    if(el.classList.contains('delete')) {
      el.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    const div = document.createElement('div');
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector('.container');
    const form = document.querySelector('#movie-form');
    container.insertBefore(div, form);

    // Vanish in 3 seconds
    setTimeout(() => document.querySelector('.alert').remove(), 3000);
  }

  static clearFields() {
    document.querySelector('#title').value = '';
    document.querySelector('#director').value = '';
    document.querySelector('#genre').value = '';
     document.querySelector('#year').value = '';
  }
}

// Store Class: Handles Storage
class Store {
  static getMovies() {
    let movies;
    if(localStorage.getItem('movies') === null) {
      movies = [];
    } else {
     movies = JSON.parse(localStorage.getItem('movies'));
    }

    return movies;
  }

  static addMovie(movie) {
    const movies = Store.getMovies();
    movies.push(movie);
    localStorage.setItem('movies', JSON.stringify(movies));
  }

  static removeMovie(genre) {
    const movies = Store.getMovies();

    movies.forEach((movie, index) => {
      if(movie.genre === genre) {
        movies.splice(index, 1);
      }
    });

    localStorage.setItem('movies', JSON.stringify(movies));
  }
}

// Event: Display Movies
document.addEventListener('DOMContentLoaded', UI.displayMovies);

// Event: Add a Movie
document.querySelector('#movie-form').addEventListener('submit', (e) => {
  // Prevent actual submit
  e.preventDefault();

  // Get form values
  const title = document.querySelector('#title').value;
  const director = document.querySelector('#director').value;
  const genre = document.querySelector('#genre').value;
   const year = document.querySelector('#year').value;

  // Validate
  if(title === '' || director === '' || genre === ''|| year === '') {
    UI.showAlert('Please fill in all fields', 'danger');
  } else {
    // Instatiate book
    const movie = new Movie(title, director, genre,year);

    // Add Book to UI
    UI.addMovieToList(movie);

    // Add book to store
    Store.addMovie(movie);

    // Show success message
    UI.showAlert('Movie Added', 'success');

    // Clear fields
    UI.clearFields();
  }
});

// Event: Remove a Book
document.querySelector('#movie-list').addEventListener('click', (e) => {
  // Remove book from UI
  UI.deleteMovie(e.target);

  // Remove book from store
  Store.removeMovie(e.target.parentElement.previousElementSibling.textContent);

  // Show success message
  UI.showAlert('Movie Removed', 'success');
});