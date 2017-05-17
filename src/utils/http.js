import request from 'request-promise';
import RateLimiter from 'request-rate-limiter';

export const limiter = new RateLimiter({
  rate: 5,
  interval: 1,
});

export const get = (options, parser) => (
  request(options)
    .then(data => console.log(data) || parser(data))
    .catch(error => console.warn('Got error: ', error))
);

/**
 * Util for creation of limited get request
 * @param {string|object} url
 * @param {function} parser
 * @param {object} options
 * @returns {Promise}
 */
export const limitedGet = (url, parser, options = {}) => (
  limiter.request(Object.assign({
    url,
    method: 'get',
  }, options
  )).then(response => {
    return parser(response.body)
  }).catch(error => {
    console.warn('Got error: ', error);
  })
);


/**
 * Create path of specific page from vod.pl
 * @param {number} site
 * @returns {string}
 */
export const createSitePath = site => (
  `/_a/list.html?lists={"SiteFilmy":{"elementId":"SiteFilmy","site":${site},"filters":{}}}`
);
