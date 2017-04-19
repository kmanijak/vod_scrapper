import jsdom from 'jsdom';
import {
  transformHtml,
  getValue,
  getValueByQuerySelector,
  getSplitValues,
  getInnerHtmlOptionalValue,
} from '../utils/transform';
import {
  queryUrlsElement,
  queryUrlsHref,
  queryMovieTitles,
  queryMovieTitle,
  queryMovieOriginalTitle,
  queryMovieCountries,
  queryMovieLanguages,
  queryMovieGenres,
  queryMovieGenre,
  queryMovieImage,
  queryMovieElement,
  queryMovieYear,
  queryMovieDuration,
  queryMovieDescription,
} from './constants';

jsdom.defaultDocumentFeatures = {
  FetchExternalResources: false,
  ProcessExternalResources: false
};

// ---MOVIES LIST---
const parseMoviesUrls = (document) => {
  const movieElements = document.querySelectorAll(queryUrlsElement);

  return Array.prototype.map.call(movieElements,
    (element) => element.querySelector(queryUrlsHref).href
  );
};

// ---MOVIE DETAILS---
const getTitles = (element) => {
  const titles = element.querySelector(queryMovieTitles);
  const title = titles && titles.querySelector(queryMovieTitle);
  const originalTitle = titles && titles.querySelector(queryMovieOriginalTitle);

  return {
    title: getInnerHtmlOptionalValue(title),
    originalTitle: getInnerHtmlOptionalValue(originalTitle),
  }
};
const getCountries = (element) => getSplitValues(element, queryMovieCountries, ',');
const getLanguages = (element) => getSplitValues(element, queryMovieLanguages, '/');
const getGenres = (element) => {
  const genresElement = element.querySelector(queryMovieGenres);
  const genres = genresElement && genresElement.querySelectorAll(queryMovieGenre);

  return genres ? Array.prototype.map.call(genres,
      (element) => getValue(element.innerHtml).replace(',', '')
    ) : [];
};
const getImage = (element) => {
  const image = element.querySelector(queryMovieImage);
  return image ? image.src : '';
};
const parseMovieDetails = (url) => (document) => {
  const movieElement = document.querySelector(queryMovieElement);

  if (movieElement) {
    const titles = getTitles(movieElement);

    return {
      url,
      title: titles.title,
      originalTitle: titles.originalTitle,
      countries: getCountries(movieElement),
      genres: getGenres(movieElement),
      image: getImage(movieElement),
      languages: getLanguages(movieElement),
      year: getValueByQuerySelector(movieElement, queryMovieYear),
      duration: getValueByQuerySelector(movieElement, queryMovieDuration),
      description: getValueByQuerySelector(movieElement, queryMovieDescription)
    };
  }
};

export const transformMoviesUrls = (rawHtml) => transformHtml(rawHtml, parseMoviesUrls);
export const transformMovieDetails = (url) => (rawHtml) => transformHtml(rawHtml, parseMovieDetails(url));
