import { limitedGet, createSitePath } from '../src/utils/http';
import { transformMoviesUrls, transformMovieDetails } from './transform';
import { hostName } from './constants';

/**
 * Get one page of movies urls trasnformed to array
 * @param {number} page
 * @returns {Promise.<Array<string>>}
 */
const getPageOfMoviesUrls = page => {
  const options = {
    host: hostName,
    path: createSitePath(page),
  };

  return limitedGet(options, transformMoviesUrls);
};

/**
 * Get all movies urls, by iterating over pages, until empty one
 * @returns {Promise.<Array<string>>}
 */
export const getAllMoviesUrls = async () => {
  let page = 1;
  const moviesUrls = [];

  while (page) {
    await getPageOfMoviesUrls(page)
      .then(urls => {
        if (urls.length) {
          page += 1;
          moviesUrls.concat(urls);
        } else {
          page = null;
        }
      });
  }

  return moviesUrls;
};

/**
 * Get movie detail
 * @param {string} url
 * @returns {Promise.<Object>}
 */
const getMovieDetails = url => (
  limitedGet(url, transformMovieDetails(url))
);

/**
 * Get all movies details based on array of urls
 * @param {Array<string>} urls
 * @returns {Promise.<Array<Object>>}
 */
export const getAllMoviesDetails = async urls => {
  await Promise.all(urls.map(
    url => getMovieDetails(url)
  )).then(details => details);
};
