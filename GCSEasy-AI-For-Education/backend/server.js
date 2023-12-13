// Import modules
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const authController = require('./controllers/authController');
const cors = require('cors');

const server = express();
require('dotenv').config();

// Middleware to parse incoming JSON requests
server.use(express.json());
server.use(cors());

mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true, // Fix the typo here
    useUnifiedTopology: true,
});

server.use(
    session({
        secret: process.env.SECRET_KEY,
        resave: false, // Fix the typo here
        saveUninitialized: false,
        cookie: { secure: false }, // Set to true when live with HTTPS
    })
);

server.post('/register', authController.register);
server.post('/login', authController.login);
server.post('/logout', authController.logout);

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
