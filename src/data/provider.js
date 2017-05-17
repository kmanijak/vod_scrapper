import { getAllMoviesUrls, getAllMoviesDetails, getGPEmployees } from './http';
import { dropUrls, dropMovies } from '../db/drop';
import { Url, Movie, User } from '../db/init';

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

export const getUsers = () => (
  getGPEmployees()
    .then(employees => {
      employees.forEach(employee => {
        const userEntry = new User(employee);
        userEntry.save();
      });
    })
    .then(() => console.log('Users saved!'))
    .catch(error => console.warn('Something went wrong during user saving', error))
);
