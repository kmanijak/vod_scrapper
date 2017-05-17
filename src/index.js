import 'babel-polyfill';
import express from 'express';
import bodyParser from 'body-parser';
import { scrapVod, getUsers } from './data/provider';
import { getUrls, getAllMovies, getMovies, getMovie, getAllUsers, getUserById } from './db/queries';

const app = express();
const port = 8080;

app.use(bodyParser.json());

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
  login(request.body.user, request.body.password)
    .then(userData => {
      response.json(userData);
    })
    .catch(err => console.log(err));
});

app.get('/users', (request, response) => {
  getAllUsers()
    .then(users => response.json(users))
    .catch(error => response.status(404).send('Not found'));
});

app.get('/user/:id', (request, response) => {
  getUserById(request.params.id)
    .then(user => response.json(user))
    .catch(error => response.status(404).send('Not found'));
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
// getUsers();
