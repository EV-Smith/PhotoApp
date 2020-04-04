const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');
const passport = require('passport');

// DB Config
const dbConnectionString = require('./config/keys').mongoURI;

const expressApp = express();

// Body parser middleware
// express gets data
expressApp.use(bodyParser.urlencoded({extended: false}));
expressApp.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(dbConnectionString)
  .then(() => console.log('MongoDB Connected!'))
  .catch(err => console.log(err));

// Passport initialization
expressApp.use(passport.initialize());
require('./config/passport')(passport);

// Set routes
expressApp.use('/api/users', users);
expressApp.use('/api/profile', profile);
expressApp.use('/api/posts', posts);

// Configure port to run web app
const port=8090;
expressApp.listen(port, () => console.log(`Server running on port ${port}`));