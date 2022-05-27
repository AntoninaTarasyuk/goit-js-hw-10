import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio'; 
import debounce from 'lodash.debounce';
import API from './js/fetch-countries';
import countryListTpl from './templates/country-list.hbs';
import countryInfoTpl from './templates/country-info.hbs';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchInput: document.getElementById('search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.searchInput.addEventListener('input', debounce(onSearchInput, DEBOUNCE_DELAY));

function onSearchInput(e) {
  const searchQuery = e.target.value.trim();
  if (searchQuery === "") {
    clearMarkup();
    return;
  };

  API.fetchCountries(searchQuery)
    .then(renderCountryList)
    .catch(onNotFoundCountry)
}

function clearMarkup() {
  refs.countryList.innerHTML = "";
  refs.countryInfo.innerHTML = "";
}

function onNotFoundCountry() {
  clearMarkup();
  Notify.failure("Oops, there is no country with that name");
}

function renderCountryList(countries) {
  if (countries.length > 10) {
    clearMarkup();
    Notify.info("Too many matches found. Please enter a more specific name");
  } else if (countries.length === 1) {
    refs.countryList.innerHTML = "";
    renderCountryInformation(countries);
  } else {
    const listMurkup = countryListTpl(countries);
    refs.countryList.innerHTML = listMurkup;
    refs.countryInfo.innerHTML = "";
  }
};

function renderCountryInformation(country) {
  const infoMarkup = countryInfoTpl(country);
  refs.countryInfo.innerHTML = infoMarkup;
};