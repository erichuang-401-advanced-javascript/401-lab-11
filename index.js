'use strict';

require('dotenv').config();
// eslint-disable-next-line no-unused-vars
const swagger = require('./docs/config/swagger');
// Start up DB Server
const mongoose = require('mongoose');
const options = {
  useNewUrlParser:true,
  useCreateIndex: true,
  useFindAndModify: false,
};
mongoose.connect(process.env.MONGODB_URI, options);

// Start the web server
require('./src/app.js').start(process.env.PORT);
