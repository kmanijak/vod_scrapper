import { getAllMoviesUrls, getAllMoviesDetails } from './http';
import { Url, Movie } from '../db/init';

export const scrapVod = () => getAllMoviesUrls()
    .then(urls => {
      urls.forEach(url => {
        const urlEntry = new Url({ url });
        urlEntry.save();
      });

      getAllMoviesDetails(urls).then(movies => {
        movies.forEach(movie => {
          const movieEntry = new Movie(movie);
          movieEntry.save();
        })
      }).catch(error => console.warn('Couldn\'t fetch movies', error));
    }).catch(error => console.warn('Couldn\'t fetch urls', error));
