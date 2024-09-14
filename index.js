const express = require('express');
const morgan = require('morgan');
const uuid = require('uuid');  // Import uuid for unique IDs

const app = express();
const port = 8080;

app.use(morgan('common'));
app.use(express.json());  // Add this to parse JSON request bodies

let users = [];  // Array to store users
const movies = [
    {
        title: 'The Shawshank Redemption',
        year: 1994,
        genre: { name: 'Drama', description: 'Dramatic and emotional storytelling.' },
        director: { name: 'Frank Darabont', bio: 'An American film director, screenwriter, and producer.', birthYear: 1959, deathYear: null },
        description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
        imageUrl: 'https://m.media-amazon.com/images/I/51NiGlapXlL._AC_SY679_.jpg',
        featured: true
    },
    {
        title: 'The Godfather',
        year: 1972,
        genre: { name: 'Crime', description: 'Crime movies focus on criminals and their activities.' },
        director: { name: 'Francis Ford Coppola', bio: 'An American film director, producer, and screenwriter.', birthYear: 1939, deathYear: null },
        description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
        imageUrl: 'https://m.media-amazon.com/images/I/41--4xHSL4L._AC_SY741_.jpg',
        featured: true
    },
    {
        title: 'The Dark Knight',
        year: 2008,
        genre: { name: 'Action', description: 'Action-packed films with intense sequences and adrenaline-fueled plots.' },
        director: { name: 'Christopher Nolan', bio: 'A British-American film director, screenwriter, and producer known for his complex storytelling.', birthYear: 1970, deathYear: null },
        description: 'Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice when the Joker wreaks havoc on Gotham City.',
        imageUrl: 'https://m.media-amazon.com/images/I/51vpnbwFHrL._AC_SY679_.jpg',
        featured: true
    },
    {
        title: 'Pulp Fiction',
        year: 1994,
        genre: { name: 'Crime', description: 'Non-linear crime stories, often featuring a dark sense of humor and intense violence.' },
        director: { name: 'Quentin Tarantino', bio: 'An American film director known for his stylized violence and quirky dialogue.', birthYear: 1963, deathYear: null },
        description: 'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.',
        imageUrl: 'https://m.media-amazon.com/images/I/71c05lTE03L._AC_SY679_.jpg',
        featured: true
    },
    {
        title: 'The Lord of the Rings: The Return of the King',
        year: 2003,
        genre: { name: 'Fantasy', description: 'Epic tales set in fantastical worlds with magical elements and heroic journeys.' },
        director: { name: 'Peter Jackson', bio: 'A New Zealand director known for bringing the world of Middle-earth to life.', birthYear: 1961, deathYear: null },
        description: 'Gandalf and Aragorn lead the World of Men against Sauron\'s army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.',
        imageUrl: 'https://m.media-amazon.com/images/I/51Qvs9i5a%2BL._AC_SY679_.jpg',
        featured: true
    },
    {
        title: 'Forrest Gump',
        year: 1994,
        genre: { name: 'Drama', description: 'Heartwarming stories that focus on personal growth and life-changing events.' },
        director: { name: 'Robert Zemeckis', bio: 'An American director and producer known for his work in live-action and animated films.', birthYear: 1952, deathYear: null },
        description: 'The presidencies of Kennedy and Johnson, Vietnam, Watergate, and other historical events unfold from the perspective of an Alabama man with an IQ of 75.',
        imageUrl: 'https://m.media-amazon.com/images/I/61pdxogT3uL._AC_SY679_.jpg',
        featured: true
    },
    {
        title: 'Inception',
        year: 2010,
        genre: { name: 'Sci-Fi', description: 'Science fiction films that explore futuristic concepts, advanced technology, and often space exploration.' },
        director: { name: 'Christopher Nolan', bio: 'A British-American film director, screenwriter, and producer known for his complex storytelling.', birthYear: 1970, deathYear: null },
        description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
        imageUrl: 'https://m.media-amazon.com/images/I/51kcuU9yLCL._AC_SY679_.jpg',
        featured: false
    },
    {
        title: 'Fight Club',
        year: 1999,
        genre: { name: 'Drama', description: 'Emotionally charged films that explore the psychological states of the characters.' },
        director: { name: 'David Fincher', bio: 'An American director known for his dark, stylish thrillers and mind-bending plots.', birthYear: 1962, deathYear: null },
        description: 'An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into something much more.',
        imageUrl: 'https://m.media-amazon.com/images/I/51v5ZpFyaFL._AC_SY679_.jpg',
        featured: false
    },
    {
        title: 'The Matrix',
        year: 1999,
        genre: { name: 'Sci-Fi', description: 'Futuristic and dystopian films exploring alternate realities and technological advancements.' },
        director: { name: 'Lana Wachowski', bio: 'An American film director, producer, and screenwriter known for groundbreaking work in science fiction.', birthYear: 1965, deathYear: null },
        description: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
        imageUrl: 'https://m.media-amazon.com/images/I/51EG732BV3L._AC_SY679_.jpg',
        featured: false
    },
    {
        title: 'Goodfellas',
        year: 1990,
        genre: { name: 'Crime', description: 'Gritty tales of mobsters, heists, and the criminal underworld.' },
        director: { name: 'Martin Scorsese', bio: 'An American director known for his work in the crime and gangster film genres.', birthYear: 1942, deathYear: null },
        description: 'The story of Henry Hill and his life in the mob, covering his rise to power and eventual downfall.',
        imageUrl: 'https://m.media-amazon.com/images/I/51rOnIjLqzL._AC_.jpg',
        featured: true
    }
];

// Welcome route
app.get('/', (req, res) => {
    res.send('Welcome to My Movie API!');
});

// Get all movies
app.get('/movies', (req, res) => {
    res.json(movies);  // This will send the entire movie object
});

// Get movie by title (with detailed info like description, genre, director, etc.)
app.get('/movies/:title', (req, res) => {
    const { title } = req.params;
    const movie = movies.find(m => m.title === title);

    if (movie) {
        res.json(movie);
    } else {
        res.status(404).send('Movie not found.');
    }
});

// Get data about a genre by genre name
app.get('/movies/genre/:genreName', (req, res) => {
    const { genreName } = req.params;
    const movie = movies.find(m => m.genre.name.toLowerCase() === genreName.toLowerCase());

    if (movie) {
        res.json({ genre: movie.genre });
    } else {
        res.status(404).send('Genre not found.');
    }
});

// Get data about a director by director name
app.get('/movies/directors/:directorName', (req, res) => {
    const { directorName } = req.params;
    const movie = movies.find(m => m.director.name.toLowerCase() === directorName.toLowerCase());

    if (movie) {
        res.json(movie.director);
    } else {
        res.status(404).send('Director not found.');
    }
});

// Create a new user
app.post('/users', (req, res) => {
    const newUser = req.body;
    if (newUser.username && newUser.password) {
        newUser.id = uuid.v4();
        newUser.favoriteMovies = [];
        users.push(newUser);
        res.status(201).json(newUser);
    } else {
        res.status(400).send('Users need a username and password.');
    }
});

// Add movie to user's favorites
app.post('/users/:id/favorites/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;
    const user = users.find(u => u.id === id);

    if (user) {
        if (movies.some(m => m.title === movieTitle)) {
            user.favoriteMovies.push(movieTitle);
            res.status(200).send(`${movieTitle} has been added to user ${id}'s favorites.`);
        } else {
            res.status(404).send('Movie not found.');
        }
    } else {
        res.status(404).send('User not found.');
    }
});

// Remove movie from user's favorites
app.delete('/users/:id/favorites/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;
    const user = users.find(u => u.id === id);

    if (user) {
        user.favoriteMovies = user.favoriteMovies.filter(m => m !== movieTitle);
        res.status(200).send(`${movieTitle} has been removed from user ${id}'s favorites.`);
    } else {
        res.status(404).send('User not found.');
    }
});

// Delete user
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex !== -1) {
        users.splice(userIndex, 1);
        res.status(200).send(`User ${id} has been deleted.`);
    } else {
        res.status(404).send('User not found.');
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
