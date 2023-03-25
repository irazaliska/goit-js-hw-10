import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import { Notify } from 'notiflix';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const inputEl = document.querySelector('#search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');

inputEl.addEventListener('input', debounce(handleInputEl, DEBOUNCE_DELAY));

function handleInputEl(event) {
  const nameOfCountry = event.target.value.trim();
  
  if (!nameOfCountry)  {
     reset();
     return
    }

  fetchCountries(nameOfCountry)
    .then(countries => {

      if (countries.length > 10) {
        reset();
        return Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
      
      if (countries.length === 1) {
        countryListEl.innerHTML = '';
        return countryInfoEl.innerHTML = renderCountryInfo(countries);
      }

      countryInfoEl.innerHTML = '';
      countryListEl.innerHTML = renderCountryList(countries);

    })

    .catch(() => {
      reset();
      Notify.failure('Oops, there is no country with that name');
    });
}

function renderCountryList(countries) {
  return countries
    .map(
      ({ name, flags }) => 
      `<li class="country-list__item">
      <img src="${flags.svg}" alt="flag" width="30" height="20">
      <p> ${name.official}</p>
      </li>`
    )
    .join('');
}

function renderCountryInfo(countries) {
  return countries
    .map(
      ({ name, capital, population, flags, languages }) =>
      `<div class="country-info__title">
      <img src="${flags.svg}" alt="flag" width="40" height="30">
      <h2>${name.official}</h2></div>
      <p><b>Capital</b>: ${capital}</p>
      <p><b>Population</b>: ${population}</p>
      <p><b>Languages</b>: ${Object.values(languages).join(', ')}</p>`
      )
    .join('');
}

function reset() {
  countryListEl.innerHTML = '';
  countryInfoEl.innerHTML = '';
}