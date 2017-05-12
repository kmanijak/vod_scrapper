import 'babel-polyfill';
import express from 'express';
import passport from 'passport';
import { scrapVod } from './data/provider';
import { getUrls, getAllMovies, getMovies, getMovie } from './db/queries';

const app = express();
const port = 8080;

// ---INIT---
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (request, response) => {
  response.send('Hello from Express!');
});



// ---MOVIES---
app.get('/movies-urls', (request, response) => {
  getUrls().then(urls => response.json(urls));
});

app.get('/movies', (request, response) => {
  getAllMovies().then(movies => response.json(movies));
});

app.get('/movies/:page', (request, response) => {
  getMovies(request.params.page)
    .then(movies => response.json(movies))
    .catch(error => response.status(404).send('Not found'));
});

app.get('/movie/:id', (request, response) => {
  getMovie(request.params.id)
    .then(movie => response.json(movie))
    .catch(error => response.status(404).send('Not found'));
});



// ---VOTING---
app.get('/votes', (request, response) => {
  response.send('Voting results');
});

app.post('/propose', (request, response) => {
  response.send('Propose movie');
});

app.post('/vote', (request, response) => {
  response.send('Vote for movie');
});



// ---USER---
app.post('/login', (request, response) => {
  response.json({});
});

app.get('/user', (request, response) => {
  response.send('Return user session and data');
});




// ---ERROR---
app.use((err, request, response, next) => {
  console.log('Error', err);
  response.status(500).send('Something broke!');
});


app.listen(port, (err) => {
  if (err) {
    return console.log('Something bad happened', err);
  }
  console.log(`Server is listening on ${port}`);
});

// scrapVod();
