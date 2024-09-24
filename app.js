const express = require('express');
const app = express();
const PORT = 8080;

// Middleware to parse JSON bodies
app.use(express.json());

/* === Movies Routes === */
app.get('/movies', (req, res) => {
    res.send('GET request to return a list of all movies');
});

app.get('/movies/:title', (req, res) => {
    const title = req.params.title;
    res.send(`GET request to return data about the movie: ${title}`);
});

app.get('/genres/:name', (req, res) => {
    const genre = req.params.name;
    res.send(`GET request to return data about the genre: ${genre}`);
});

app.get('/directors/:name', (req, res) => {
    const director = req.params.name;
    res.send(`GET request to return data about the director: ${director}`);
});

/* === Users Routes === */
app.post('/users', (req, res) => {
    res.send('POST request to register a new user');
});

app.put('/users/:username', (req, res) => {
    const username = req.params.username;
    res.send(`PUT request to update user info for: ${username}`);
});

app.post('/users/:username/favorites/:movieId', (req, res) => {
    const { username, movieId } = req.params;
    res.send(`POST request to add movie ${movieId} to ${username}'s favorites`);
});

app.delete('/users/:username/favorites/:movieId', (req, res) => {
    const { username, movieId } = req.params;
    res.send(`DELETE request to remove movie ${movieId} from ${username}'s favorites`);
});

app.delete('/users/:username', (req, res) => {
    const username = req.params.username;
    res.send(`DELETE request to deregister user: ${username}`);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
