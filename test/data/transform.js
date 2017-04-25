import assert from 'assert';
import mockedMoviesUrlPage from '../mocks/movies-urls-page.js';
import mockedMovieDetailsPage from '../mocks/movie-details-page.js';
import { transformMoviesUrls, transformMovieDetails } from '../../src/data/transform';

describe('transformMoviesUrls', () => {
  it('should parse empty string', () => {
    assert.deepEqual(transformMoviesUrls(''), []);
  });

  it ('should parse HTML containing proper data', () => {
    const moviesUrl = transformMoviesUrls(mockedMoviesUrlPage);

    assert.equal(moviesUrl.length, 24);
    assert.equal(moviesUrl[0], 'https://vod.pl/filmy/viva/vppcd3y');
    assert.equal(moviesUrl[23], 'https://vod.pl/filmy/bialy-dmuchawiec/v6z60rw');
  });
});

describe('transformMovieDetails', () => {
  it('should return null when movie element not found', () => {
    assert.equal(transformMovieDetails('')(''), null);
  });

  it('should parse HTML containing movie details', () => {
    const movieDetails = transformMovieDetails('https://vod.pl/filmy/glosniej-od-bomb-online-caly-film-orginalny/8zvjlvm')(mockedMovieDetailsPage);

    assert.deepEqual(movieDetails, {
      url: 'https://vod.pl/filmy/glosniej-od-bomb-online-caly-film-orginalny/8zvjlvm',
      title: 'Głośniej od bomb',
      originalTitle: 'Louder Than Bombs',
      countries: ['Dania', 'Francja', 'Norwegia'],
      genres: ['Dramat'],
      languages: ['Napisy PL'],
      image: 'https://ocdn.eu/pulscms-transforms/1/k8lktkqTURBXy84ODI0OWZkY2I5OGIyMzE0NzhkZGI3NTM5Y2ZiMDdiYy5qcGVnkZMFzQEszQG4',
      year: '2015',
      duration: '104 min',
      description: '"Głośniej od bomb" to film nominowany do Złotej Palmy w Cannes, zdobywca nagrody dla najlepszej zagranicznej produkcji na Sztokholskim Festiwalu Filmowym.\nIsabelle, jest niezwykle utalentowaną fotografką wojenką. Pewnego dnia ginie w wypadku drogowym, zostawiając męża, Gene\'a i osieracając dwóch synów. Po trzech latach od wypadku starszy syn, Jonah, powraca do rodzinnego domu, w którym wciąż mieszka owdowiały ojciec wraz z młodszym synem, Conradem. Gene stara się, by zespolona pod jednym dachem trójka znów mogła funkcjonować jak normalna rodzina. Okazuje się to jednak znacznie trudniejsze, niż mogłoby się wydawać...\nW filmie "Głośniej od bomb" świetne role sworzyli Isabelle Huppert, Gabriel Byrne, Jesse Eisenberg i Devid Druid.'
    });
  });
});
