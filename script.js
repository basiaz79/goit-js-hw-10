import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const searchBox = document.getElementById('search-box');
const countryList = document.getElementById('country-list');

searchBox.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(event) {
    const query = event.target.value.trim();

    if (query === '') {
        clearResults();
        return;
    }

    fetchCountries(query)
        .then(countries => {
            clearResults();
            if (countries.length > 10) {
                Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
            } else if (countries.length >= 2 && countries.length <= 10) {
                renderCountryList(countries);
            } else if (countries.length === 1) {
                renderCountryInfo(countries[0]);
            }
        })
        .catch(error => {
            clearResults();
            Notiflix.Notify.failure('Oops, there is no country with that name');
        });
}

function renderCountryList(countries) {
    const markup = countries.map(country => {
        return `<div class="country-item">
                    <img src="${country.flags.svg}" alt="Flag of ${country.name.official}">
                    <p>${country.name.official}</p>
                </div>`;
    }).join('');
    countryList.innerHTML = markup;
}

function renderCountryInfo(country) {
    const languages = Object.values(country.languages).join(', ');
    const markup = `<div class="country-item">
                        <img src="${country.flags.svg}" alt="Flag of ${country.name.official}">
                        <h2>${country.name.official}</h2>
                        <p><b>Capital:</b> ${country.capital}</p>
                        <p><b>Population:</b> ${country.population}</p>
                        <p><b>Languages:</b> ${languages}</p>
                    </div>`;
    countryList.innerHTML = markup;
}

function clearResults() {
    countryList.innerHTML = '';
}
