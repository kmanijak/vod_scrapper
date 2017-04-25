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



// MOVIES LIST
/**
 * Parser for page with movies urls
 * @param {string} document
 * @returns {Array<string>}
 */
const parseMoviesUrls = document => {
  const movieElements = document.querySelectorAll(queryUrlsElement);

  return Array.prototype.map.call(movieElements,
    element => element.querySelector(queryUrlsHref).href
  );
};



// MOVIE DETAILS
/**
 * Parser for titles in titles element
 * @param {Object} element
 * @returns {{title: ?string, originalTitle: ?string}}
 */
const getTitles = element => {
  const titles = element.querySelector(queryMovieTitles);
  const title = titles && titles.querySelector(queryMovieTitle);
  const originalTitle = titles && titles.querySelector(queryMovieOriginalTitle);

  return {
    title: getInnerHtmlOptionalValue(title),
    originalTitle: getInnerHtmlOptionalValue(originalTitle),
  }
};

/**
 * Parser for countries
 * @param {Object} element
 * @returns {Array<string>}
 */
const getCountries = element => getSplitValues(element, queryMovieCountries, ',');

/**
 * Parser for languages
 * @param {Object} element
 * @returns {Array<string>}
 */
const getLanguages = element => getSplitValues(element, queryMovieLanguages, '/');

/**
 * Parser for genres
 * @param {Object} element
 * @returns {Array<string>}
 */
const getGenres = element => {
  const genresElement = element.querySelector(queryMovieGenres);
  const genres = genresElement && genresElement.querySelectorAll(queryMovieGenre);

  return genres ? Array.prototype.map.call(genres,
      element => getValue(element.innerHTML).replace(',', '')
    ) : [];
};

/**
 * Parser for image source
 * @param {Object} element
 * @returns {string}
 */
const getImage = element => {
  const image = element.querySelector(queryMovieImage);
  return image ? image.src : '';
};

/**
 * Parser for description containing few paragraphs
 * @param element
 * @returns {string}
 */
const getDescription = element => {
  const descriptionParagraphs = element.querySelectorAll(queryMovieDescription);

  return descriptionParagraphs ? Array.prototype.reduce.call(descriptionParagraphs,
      (description, element) => description ? `${description}\n${element.innerHTML}` : element.innerHTML, ''
    ) : '';
};

/**
 * Parser for page with movies details
 * @param {string} url
 * @returns {function}
 */
const parseMovieDetails = url =>
  /**
   * @param {Object} document
   * @returns {?{
   *  url: string,
   *  title: string,
   *  originalTitle: string,
   *  countries: Array<string>,
   *  genres: Array<string>,
   *  languages: Array<string>,
   *  image: string,
   *  year: string,
   *  duration: string,
   *  description: string
   * }}
   */
  document => {
    const movieElement = document.querySelector(queryMovieElement);

    if (movieElement) {
      const { title, originalTitle } = getTitles(movieElement);

      return {
        url,
        title,
        originalTitle,
        countries: getCountries(movieElement),
        genres: getGenres(movieElement),
        languages: getLanguages(movieElement),
        image: getImage(movieElement),
        year: getValueByQuerySelector(movieElement, queryMovieYear),
        duration: getValueByQuerySelector(movieElement, queryMovieDuration),
        description: getDescription(movieElement)
      };
    }
    return null;
  };

/**
 * Transform rawHtml page of partial movies list
 * (e.g. )
 * into array of movies urls
 *
 * @param {string} rawHtml
 * @returns {Array<string>}
 */
export const transformMoviesUrls = rawHtml => transformHtml(rawHtml, parseMoviesUrls);

/**
 * Transform rawHtml page of particular movie
 * (e.g.)
 * into object with movie details
 *
 * @param {string} url
 * @returns {function}
 */
export const transformMovieDetails = url =>
  /**
   * @param {string} rawHtml
   * @returns {?{
   *  url: string,
   *  title: string,
   *  originalTitle: string,
   *  countries: Array<string>,
   *  genres: Array<string>,
   *  languages: Array<string>,
   *  image: string,
   *  year: string,
   *  duration: string,
   *  description: string
   * }}
   */
  rawHtml => transformHtml(rawHtml, parseMovieDetails(url));
