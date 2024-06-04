require("dotenv").config();
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const port = process.env.PORT || 8000;

// used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-startergy'); // Ensure this path is correct
const MongoStore = require('connect-mongo');

// cookie-parser
const cookieParser = require('cookie-parser');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// database
const db = require('./config/mongoose'); // Ensure this file configures and connects to mongoose

// include layouts
const expressLayouts = require('express-ejs-layouts');
app.use(expressLayouts);

// for styling static files
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

// static files
app.use(express.static('./assets'));

// EJS Set-up
app.set('view engine', 'ejs');
app.set('views', './views');

// MongoStore stores session cookies
app.use(session({
    name: 'MovieApp',
    secret: process.env.SESSION_SECRET || 'blahsomething', // Use environment variable for secret
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100) // 100 minutes
    },
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL || 'your-default-mongo-url',
        autoRemove: 'disabled'
    }, function (err) {
        console.log(err || "Connection to MongoDB is fine");
    })
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

// Use routes defined in routes/index.js
app.use('/', require('./routes'));

// Start the server
app.listen(port, function (err) {
    if (err) {
        console.log("Error:", err);
        return;
    }
    console.log("Successfully running on port", port);
});
