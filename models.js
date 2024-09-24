const mongoose = require('mongoose');
const { Schema } = mongoose;

// Movie Schema
const movieSchema = new Schema({
    title: { type: String, required: true },
    year: Number,
    genre: {
        name: String,
        description: String
    },
    director: {
        name: String,
        bio: String,
        birthYear: Number,
        deathYear: Number
    },
    description: String,
    imageUrl: String,
    featured: Boolean
});

// User Schema
const userSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: String,
    birthday: Date,
    favoriteMovies: [{ type: Schema.Types.ObjectId, ref: 'Movie' }]
});

// Create Models
const Movie = mongoose.model('Movie', movieSchema);
const User = mongoose.model('User', userSchema);

// Export the models
module.exports = { Movie, User };
