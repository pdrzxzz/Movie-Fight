const createAutoComplete = ({ 
    root, 
    renderOption, 
    onOptionSelect, 
    inputValue, 
    fetchData }) => {

    root.innerHTML = `
    <label><b>Search</b></label>
    <input class="input" />
    <div class="dropdown">
        <div class="dropdown-menu">
        <div class="dropdown-content results"></div>
        </div>
    </div>`;
    const dropdown = root.querySelector('.dropdown'); //select dropdown to use the is-active class
    const resultsWrapper = root.querySelector('.results'); //select div to show the results

    const onInput = async event => {
        if (event.target.value) { //if there's an input
            const items = await fetchData(event.target.value); //search on api
            resultsWrapper.innerHTML = ''; //clear all past results

            displayDropdown();
            if (!items.length && event.target.value) { //if we dont find a item and there's an input.
                resultsWrapper.append('No results found!');
                return;
            };

            for (let item of items) { //for each item found
                const option = document.createElement('a');
                option.classList.add('dropdown-item'); //Bulma styling
                option.innerHTML = renderOption(item);
                option.addEventListener('click', () => { //user selects a item
                    hideDropdown();
                    input.value = inputValue(item);
                    onOptionSelect(item);
                })
                resultsWrapper.appendChild(option);
            };


        }
        else { //if there's no input (the user erases all)
            hideDropdown();
        }
    }

    const input = root.querySelector('input');
    input.addEventListener('input', debounce(onInput, 250))

    const displayDropdown = () => {
        console.log('Display Dropdown.')

        dropdown.classList.add('is-active');

        setTimeout(() => {
            document.addEventListener('click', (event) => {
                if (!root.contains(event.target)) {
                    hideDropdown()
                }
            }
            )
        }, 100);
    }

    const hideDropdown = () => {
        console.log('Hide dropdown.')
        dropdown.classList.remove('is-active');
        document.removeEventListener('click', hideDropdown)
        if (input.value) {
            input.addEventListener('click', displayDropdown)
        }
    }
}