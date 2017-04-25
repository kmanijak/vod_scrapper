import RateLimiter from 'request-rate-limiter';

const limiter = new RateLimiter({
  rate: 5,
  interval: 1,
});

/**
 * Util for creation of limited get request
 * @param {string|object} url
 * @param {function} parser
 * @returns {Promise}
 */
export const limitedGet = (url, parser) => (
  limiter.request({
    url,
    method: 'get'
  }).then(response => (
    parser(response.body)
  )).catch(error => {
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
