require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { validateBearerToken } = require('./authenticate.js');
const { NODE_ENV } = require('./config');

const bookmarksRouter = require('.bookmarks/bookmarks-router');

const app = express();

const morganOpt =
  ( NODE_ENV === 'production' )
    ? 'tiny'
    : 'common';

app.use(
  morgan(morganOpt),
  helmet(),
  cors(),
  validateBearerToken,
  bookmarksRouter
);

/* //////////////////////////////
Dependencies and setup completed
////////////////////////////// */

app.get('/', (req, res) => {
  res.send({
    status: 'Server is up'
  });
});

errorHandler = (err, req, res, next) => {
  let response;
  if (NODE_ENV === 'production') {
    response = { 
      error: { 
        message: 'server error' 
      }
    };
  } else {
    console.error(err);
    response = {
      message: err.message, err
    };
  }
  res.status(500).json(response)
};

app.use(errorHandler);

module.exports = app;