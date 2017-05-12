import { getAllMoviesUrls, getAllMoviesDetails } from './http';
import { dropUrls, dropMovies } from '../db/drop';
import { Url, Movie } from '../db/init';

export const scrapVod = () => (
  dropUrls()
    .then(() => dropMovies())
    .then(() => getAllMoviesUrls())
    .then(urls => {
      urls.forEach(url => {
        const urlEntry = new Url({ url });
        urlEntry.save();
      });

      return getAllMoviesDetails(urls);
    })
    .then(movies => (
      movies.forEach(movie => {
        if (movie) {
          const movieEntry = new Movie(movie);
          movieEntry.save();
        }
      })
    ))
    .then(() => console.log('Scrapping finished successfully!'))
    .catch(error => console.warn('Something went wrong during scrapping', error))
);
