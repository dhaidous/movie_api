const express = require('express');
const morgan = require('morgan');
const uuid = require('uuid');  // Import uuid for unique IDs
const bodyParser = require('body-parser');

//Imports from models.js
const mongoose = require('mongoose');
const Models = require('./models.js');
const Movies = Models.Movie;
const Users = Models.User;

// MongoDB connection
/* mongoose.connect('mongodb://localhost:27017/moviesDB')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));*/

mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect('mongodb+srv://haidous21:17qKGpgfj319IAWm@mydb.nq0kh.mongodb.net/myDB?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
// Create Express app
const app = express();

app.use(morgan('common'));
app.use(express.json());  // Add this to parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true }));

const { generateJWTToken } = require('./auth');
const bcrypt = require('bcrypt');
const cors = require('cors');
const { check, validationResult } = require('express-validator');  // Insert here

let allowedOrigins = ['http://localhost:8080', 'http://testsite.com'];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) { // If a specific origin isn’t found on the list of allowed origins
            let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
            return callback(new Error(message), false);
        }
        return callback(null, true);
    }
}));

/* rest of code goes here*/

let auth = require('./auth')(app);

const passport = require('passport');
require('./passport');


// REST API routes and other code follow...


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

// Allow admin to add a new movie
/*
app.post('/movies', (req, res) => {
    Movies.create(req.body)
        .then((newMovie) => {
            res.status(201).json(newMovie); // Send back the newly created movie as a response
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});
*/
app.get('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Movies.find()
        .then((movies) => {
            res.status(201).json(movies);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
});



// Get all movies
app.get('/movies', (req, res) => {
    Movies.find()
        .then((movies) => {
            res.status(200).json(movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});



// Get movie by title (with detailed info like description, genre, director, etc.)
// Return data about a single movie by title
app.get('/movies/:title', (req, res) => {
    Movies.findOne({ title: req.params.title }) // Find the movie by title
        .then((movie) => {
            if (movie) {
                res.status(200).json(movie);
            } else {
                res.status(404).send('Movie not found.');
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});


// Get data about a genre by genre name
// Return data about a genre by genre name
app.get('/movies/genre/:genreName', (req, res) => {
    Movies.findOne({ 'genre.name': req.params.genreName }) // Find movie by genre
        .then((movie) => {
            if (movie) {
                res.status(200).json({ genre: movie.genre });
            } else {
                res.status(404).send('Genre not found.');
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});


// Get data about a director by director name
// Return data about a director by director name
app.get('/movies/directors/:directorName', (req, res) => {
    Movies.findOne({ 'director.name': req.params.directorName }) // Find movie by director
        .then((movie) => {
            if (movie) {
                res.status(200).json(movie.director);
            } else {
                res.status(404).send('Director not found.');
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});



// Create a new user
app.post('/users', async (req, res) =>
    // Validation logic here for request
    //you can either use a chain of methods like .not().isEmpty()
    //which means "opposite of isEmpty" in plain english "is not empty"
    //or use .isLength({min: 5}) which means
    //minimum value of 5 characters are only allowed
    [
        check('Username', 'Username is required').isLength({ min: 5 }),
        check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
        check('Password', 'Password is required').not().isEmpty(),
        check('Email', 'Email does not appear to be valid').isEmail()
    ], async (req, res) => {

        // check the validation object for errors
        let errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        let hashedPassword = Users.hashPassword(req.body.Password);
        await Users.findOne({ Username: req.body.Username }) // Search to see if a user with the requested username already exists
            .then((user) => {
                if (user) {
                    //If the user is found, send a response that it already exists
                    return res.status(400).send(req.body.Username + ' already exists');
                } else {
                    Users
                        .create({
                            Username: req.body.Username,
                            Password: hashedPassword,
                            Email: req.body.Email,
                            Birthday: req.body.Birthday
                        })
                        .then((user) => { res.status(201).json(user) })
                        .catch((error) => {
                            console.error(error);
                            res.status(500).send('Error: ' + error);
                        });
                }
            })
            .catch((error) => {
                console.error(error);
                res.status(500).send('Error: ' + error);
            });
    });

/*
// Allow users to update their user info
app.put('/users/:username', async (req, res) => {
    try {
        const updatedUser = await Users.findOneAndUpdate(
            { username: req.params.username }, // Find user by username
            {
                $set: {
                    username: req.body.username, // Update fields from request body
                    password: req.body.password,
                    email: req.body.email,
                    birthday: req.body.birthday
                }
            },
            { new: true, runValidators: true } // Return the updated document and run schema validators
        );

        if (!updatedUser) {
            return res.status(404).send('User not found.');
        }

        return res.status(200).json(updatedUser); // Return the updated user
    } catch (err) {
        console.error(err);
        return res.status(500).send('Error: ' + err);
    }
});
*/


app.put('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        // Debug logs to check values
        console.log('req.user:', req.user);
        console.log('req.params.Username:', req.params.Username);

        // Check if req.user is populated and compare usernames (case-insensitive)
        if (!req.user) {
            return res.status(401).send('Unauthorized: req.user is undefined');
        }

        // Corrected to use req.user.username instead of req.user.Username
        if (req.user.username.toLowerCase() !== req.params.Username.toLowerCase()) {
            return res.status(400).send('Permission denied: You can only update your own profile.');
        }

        // Hash password if it's being updated
        let updatedFields = {
            Username: req.body.Username || req.user.username, // Keep old username if not changing
            Email: req.body.Email,
            Birthday: req.body.Birthday
        };

        if (req.body.Password) {
            const hashedPassword = await bcrypt.hash(req.body.Password, 10); // Hash the password
            updatedFields.Password = hashedPassword;
        }

        // Find user and update
        const updatedUser = await Users.findOneAndUpdate(
            { username: req.params.Username },
            { $set: updatedFields },
            { new: true }  // Return the updated user document
        );

        if (!updatedUser) {
            return res.status(404).send('User not found');
        }

        // Return the updated user
        return res.json(updatedUser);
    } catch (err) {
        console.error('Error:', err);
        return res.status(500).send('Error: ' + err.message);
    }
});





// Add movie to user's favorites
// Allow users to add a movie to their list of favorites
app.post('/users/:username/movies/:movieId', async (req, res) => {
    try {
        const updatedUser = await Users.findOneAndUpdate(
            { username: req.params.username },
            { $push: { favoriteMovies: req.params.movieId } }, // Add movie ID to the array
            { new: true } // Return the updated document
        );

        if (!updatedUser) {
            return res.status(404).send('User not found.');
        }

        return res.status(200).json(updatedUser); // Return the updated user
    } catch (err) {
        console.error(err);
        return res.status(500).send('Error: ' + err);
    }
});



// Remove movie from user's favorites
// Allow users to remove a movie from their list of favorites
app.delete('/users/:username/movies/:movieId', async (req, res) => {
    try {
        const updatedUser = await Users.findOneAndUpdate(
            { username: req.params.username },
            { $pull: { favoriteMovies: req.params.movieId } }, // Remove movie ID from the array
            { new: true } // Return the updated document
        );

        if (!updatedUser) {
            return res.status(404).send('User not found.');
        }

        return res.status(200).json(updatedUser); // Return the updated user
    } catch (err) {
        console.error(err);
        return res.status(500).send('Error: ' + err);
    }
});



// Delete user
// Delete user (Allow existing users to deregister)
app.delete('/users/:username', async (req, res) => {
    try {
        const user = await Users.findOneAndDelete({ username: req.params.username });

        if (!user) {
            return res.status(404).send(req.params.username + ' was not found.');
        }

        return res.status(200).send(req.params.username + ' was deleted.');
    } catch (err) {
        console.error(err);
        return res.status(500).send('Error: ' + err);
    }
});


// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start the server
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
    console.log('Listening on Port ' + port);
});

