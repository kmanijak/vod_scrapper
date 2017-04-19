import express from 'express';

const app = express();
const port = 3000;

app.get('/', (request, response) => {
    response.send('Hello from Express!')
});

app.use((err, request, response, next) => {
    console.log('Error', err);
    response.status(500).send('Something broke!')
});


app.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }

    console.log(`server is listening on ${port}`)
});