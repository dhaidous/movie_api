const jwtSecret = 'your_jwt_secret'; // This has to be the same key used in the JWTStrategy

const jwt = require('jsonwebtoken');
const passport = require('passport');

require('./passport'); // Your local passport file


let generateJWTToken = (user) => {
    return jwt.sign({
        _id: user._id,            // Include the user's _id in the token payload
        Username: user.Username    // Include other fields if necessary
    }, jwtSecret, {
        subject: user.Username,    // You can use 'subject' to store any identifying information
        expiresIn: '7d',           // Token will expire in 7 days
        algorithm: 'HS256'         // JWT signing algorithm
    });
}



/* POST login. */
module.exports = (router) => {
    router.post('/login', (req, res) => {
        passport.authenticate('local', { session: false }, (error, user, info) => {
            if (error || !user) {
                return res.status(400).json({
                    message: 'Something is not right',
                    user: user
                });
            }
            req.login(user, { session: false }, (error) => {
                if (error) {
                    res.send(error);
                }
                let token = generateJWTToken(user.toJSON());
                return res.json({ user, token });
            });
        })(req, res);
    });
}

module.exports.generateJWTToken = generateJWTToken;