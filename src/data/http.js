import key from '../../key.json';
import { get, limitedGet, createSitePath } from '../utils/http';
import { transformMoviesUrls, transformMovieDetails, transformEmployees } from './transform';

/**
 * Get one page of movies urls trasnformed to array
 * @param {number} page
 * @returns {Promise.<Array<string>>}
 */
const getPageOfMoviesUrls = page => limitedGet(`https://vod.pl${createSitePath(page)}`, transformMoviesUrls);

/**
 * Get all movies urls, by iterating over pages, until empty one
 * @returns {Promise.<Array<string>>}
 */
export const getAllMoviesUrls = async () => {
  let page = 1;
  let moviesUrls = [];

  while (page) {
    await getPageOfMoviesUrls(page)
      .then(urls => {
        if (urls.length) {
          console.log(`Successfully fetched ${page}. page of urls`);
          moviesUrls = moviesUrls.concat(urls);
          page += 1;
        } else {
          page = null;
        }
      }).catch(error => console.log(error));
  }

  return moviesUrls;
};

/**
 * Get movie detail
 * @param {string} url
 * @returns {Promise.<Object>}
 */
const getMovieDetails = url => limitedGet(url, transformMovieDetails(url));

/**
 * Get all movies details based on array of urls
 * @param {Array<string>} urls
 * @returns {Promise.<Array<Object>>}
 */
export const getAllMoviesDetails = async urls => (
  await Promise.all(urls.map(
    url => getMovieDetails(url).then(details => {
      console.log(`Successfully fetched ${details.title} movie details`);
      return details;
    }).catch(
      error => console.warn(`Couldn\'t fetch movie from ${url}`, error)
    )
  ))
);

export const getGPEmployees = async () => {
  const appKeyBase64 = new Buffer(`${key.applicationKey}:x`).toString('base64');
  const options = {
    url: 'https://api.bamboohr.com/api/gateway.php/grandparade/v1/employees/directory',
    method: 'GET',
    headers: {
      Authorization: `Basic ${appKeyBase64}`,
      Accept: 'application/json',
      Host: 'api.bamboohr.com'
    }
  };

  return await get(options, transformEmployees);
};
