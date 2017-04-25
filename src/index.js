import 'babel-polyfill';
import express from 'express';
import { scrapVod } from './data/provider';
import { getUrls, getMovies } from './db/queries';

const app = express();
const port = 8080;

app.get('/', (request, response) => {
  response.send('Hello from Express!');
});



// ---MOVIES---
app.get('/movies-urls', (request, response) => {
  getUrls().then(urls => response.json(urls));
});

app.get('/movies', (request, response) => {
  response.send('List of all movies details.');
});

app.get('/movies/:page', (request, response) => {
  getMovies(request.params.page).then(movies => response.json(movies));
});

app.get('/movie/:id', (request, response) => {
  response.send('Details of particular movie.');
});



// ---VOTING---
app.post('/propose', (request, response) => {
  response.send('Propose movie');
});

app.post('/vote', (request, response) => {
  response.send('Vote for movie');
});

app.get('/votes', (request, response) => {
  response.send('Voting results');
});



// ---USER---
app.post('/login', (request, response) => {
  response.send('Login user');
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
    return console.log('something bad happened', err);
  }
  console.log(`server is listening on ${port}`);
});

scrapVod();
