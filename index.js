const fetchData = async searchTerm => {
  const response = await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey: 'd9835cc5',
      s: searchTerm,
    }
  });

  if (response.data.Error) {
    return [];
  };

  return response.data.Search;

};

const autocompleteRoot = document.querySelector('.autocomplete');
autocompleteRoot.innerHTML = `
  <label><b>Search For a Movie</b></label>
  <input class="input" />
  <div class="dropdown">
    <div class="dropdown-menu">
      <div class="dropdown-content results"></div>
    </div>
  </div>
`;

const dropdown = document.querySelector('.dropdown'); //select dropdown to use the is-active class
const resultsWrapper = document.querySelector('.results'); //select to show the results

const onInput = async event => {
  if (event.target.value) { //if there's an input
    const movies = await fetchData(event.target.value); //search on api
    resultsWrapper.innerHTML = ''; //clear all past results

    displayDropdown();
    for (let movie of movies) { //for each movie found
      if (movie.Poster != 'N/A') { //if movie has an poster image
        const option = document.createElement('a');
        option.classList.add('dropdown-item'); //Bulma styling
        option.innerHTML = `<img src="${movie.Poster}" /> ${movie.Title}`;
        resultsWrapper.appendChild(option);
      }
    };

    if (!movies.length && event.target.value) { //if we dont find a movie and there's an input.
      resultsWrapper.append('No results found!');
    };
  }
  else { //if there's no input (the user erases all)
    hideDropdown();
  }
}

const input = document.querySelector('input');
input.addEventListener('input', debounce(onInput, 500))

const displayDropdown = () => {
  dropdown.classList.add('is-active');
  document.addEventListener('click', hideDropdown)
}

const hideDropdown = () => {
  dropdown.classList.remove('is-active');
  document.removeEventListener('click', hideDropdown)
  // if (input.value) {
  //   input.addEventListener('click', displayDropdown)
  // }
}

