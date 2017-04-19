import { limitedGet, createSitePath } from '../utils/http';
import { transformMoviesUrls, transformMovieDetails } from './transform';

/**
 * Get one page of movies urls trasnformed to array
 * @param {number} page
 * @returns {Promise}
 */
export const getMoviesUrls = (page) => {
  const options = {
    host: 'vod.pl',
    path: createSitePath(page),
  };

  return limitedGet(options, transformMoviesUrls);
};

/**
 * Get movie detail
 * @param {string} url
 */
export const getMovieDetails = (url) => (
  limitedGet(url, transformMovieDetails)
);
