const autocompleteConfig = {
  renderOption(movie) {
    if (movie.Poster !== 'N/A') {
      return `<img src="${movie.Poster}" /> ${movie.Title} (${movie.Year})`;
    }
    return '';
  },
  inputValue(movie) {
    return movie.Title;
  },
  fetchData: async searchTerm => {
    const response = await axios.get('http://www.omdbapi.com/', {
      params: {
        apikey: 'd9835cc5',
        s: searchTerm,
      }
    });

    if (response.data.Error) { //if no movies found
      return [];
    };

    return response.data.Search;
  }
}

createAutoComplete({
  ...autocompleteConfig,
  root: document.querySelector(`#left-autocomplete`),
  onOptionSelect(movie) {
    document.querySelector('#tutorial').classList.add('is-hidden'); //hide tutorial
    onMovieSelect(movie, document.querySelector(`#left-summary`), 'left')
  }
})

createAutoComplete({
  ...autocompleteConfig,
  root: document.querySelector(`#right-autocomplete`),
  onOptionSelect(movie) {
    document.querySelector('#tutorial').classList.add('is-hidden'); //hide tutorial
    onMovieSelect(movie, document.querySelector(`#right-summary`), 'right')
  }
})


let leftMovie;
let rightMovie;
const onMovieSelect = async (movie, summary, side) => {
  const response = await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey: 'd9835cc5',
      i: movie.imdbID,
    }
  });
  summary.innerHTML = movieTemplate(response.data);

  if (side === 'left') {
    leftMovie = response.data;
  } else {
    rightMovie = response.data;
  }

  if (leftMovie && rightMovie) {
    runComparison();
  }
}

const runComparison = () => {
  const leftSideStats = document.querySelectorAll('#left-summary .notification');
  const rightSideStats = document.querySelectorAll('#right-summary .notification');

  leftSideStats.forEach((leftStat, index) => {
    const rightStat = rightSideStats[index];

    const leftSideValue = parseFloat(leftStat.dataset.value);
    const rightSideValue = parseFloat(rightStat.dataset.value);

    if (rightSideValue > leftSideValue) {
      leftStat.classList.remove('is-primary');
      leftStat.classList.add('is-danger');
    } else {
      rightStat.classList.remove('is-primary');
      rightStat.classList.add('is-danger');
    }
  })

}


const movieTemplate = (movieDetail) => {

  const dollars = parseInt(movieDetail.BoxOffice.replace('$', '').replaceAll(',', ''));
  const metascore = parseInt(movieDetail.Metascore);
  const imdbRating = parseFloat(movieDetail.imdbRating);
  const imdbVotes = parseInt(movieDetail.imdbVotes.replaceAll(',', ''));

  const awards = movieDetail.Awards.split(' ').reduce((count, value) => {
    value = parseInt(value);
    if (isNaN(value)) {
      return count;
    } else {
      return count + value;
    }
  }, 0);

  return `
    <article class="media">
      <figure class="media-left">
        <p class="image">
          <img src=${movieDetail.Poster} alt="">
        </p>
      </figure>
      <div class="media-content">
        <div class="content">
          <h1>${movieDetail.Title} ${movieDetail.Year}</h1>
          <h4>${movieDetail.Genre}</h4>
          <p>${movieDetail.Plot}</p>
        </div>
      </div>
    </article>

    <article data-value=${awards} class="notification is-primary">
      <p class="title">${movieDetail.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>

    <article data-value=${dollars} class="notification is-primary">
      <p class="title">${movieDetail.BoxOffice}</p>
      <p class="subtitle">Box Office</p>
    </article>

    <article data-value=${metascore} class="notification is-primary">
      <p class="title">${movieDetail.Metascore}</p>
      <p class="subtitle">Metascore</p>
    </article>

    <article data-value=${imdbRating} class="notification is-primary">
      <p class="title">${movieDetail.imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
    </article>

    <article data-value=${imdbVotes} class="notification is-primary">
      <p class="title">${movieDetail.imdbVotes}</p>
      <p class="subtitle">IMDB Votes</p>
    </article>


   `
}