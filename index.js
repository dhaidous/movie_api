const express = require('express');
const morgan = require('morgan');

const app = express();
const port = 8080;

app.use(morgan('common'));
app.use(express.static('public'));

const movies = [
    { title: 'The Shawshank Redemption', year: 1994, genre: 'Drama' },
    { title: 'The Godfather', year: 1972, genre: 'Crime' },
    { title: 'The Dark Knight', year: 2008, genre: 'Action' },
    { title: 'Pulp Fiction', year: 1994, genre: 'Crime' },
    { title: 'The Lord of the Rings: The Return of the King', year: 2003, genre: 'Fantasy' },
    { title: 'Forrest Gump', year: 1994, genre: 'Drama' },
    { title: 'Inception', year: 2010, genre: 'Sci-Fi' },
    { title: 'Fight Club', year: 1999, genre: 'Drama' },
    { title: 'The Matrix', year: 1999, genre: 'Sci-Fi' },
    { title: 'Goodfellas', year: 1990, genre: 'Crime' }
];

app.get('/', (req, res) => {
    res.send('Welcome to My Movie API!');
});

app.get('/movies', (req, res) => {
    res.json(movies);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
