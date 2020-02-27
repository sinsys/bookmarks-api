const express = require('express');
const uuid = require('uuid');
const logger = require('../logger');
const xss = require('xss');

const bodyParser = express.json();
const bookmarksRouter = express.Router();
const BookmarksService = require('./bookmarks-service');

serializeBookmark = (bookmark) => {
  return ({
    id: bookmark.id,
    title: xss(bookmark.title),
    url: xss(bookmark.url),
    desc: xss(bookmark.desc),
    rating: xss(rating)
  });
};

bookmarksRouter
  .route('/bookmarks')
  .get( (req, res, next) => {
    const knexInst = req.app.get('db');
    BookmarksService
      .getAll(knexInst)
      .then(bookmarks => {
        res.json(bookmarks);
      })
      .catch(next);
  })
  .post( bodyParser, (req, res, next) => {
    const {
      title,
      url,
      desc,
      rating
    } = req.body;

    const validUrl = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;

    if ( !validUrl.test(url) ) {
      logger.error(`URL is incorrect format`);
      return (
        res
          .status(400)
          .send('Invalid url')
      );
    };

    if ( isNaN(parseInt(rating)) ) {
      logger.error(`Rating must be a number`);
      return (
        res
        .status(400)
        .send('Invalid rating')
      );
    };

    if ( 
      rating < 1 ||
      rating > 5
     ) {
      logger.error(`Rating must be a number between 1 and 5`);
      return (
        res
        .status(400)
        .send('Rating must be an integer between 1 and 5')
      );
    };

    const id = uuid();
    const bookmark = {
      id,
      title,
      url,
      desc,
      rating
    };

    for ( const [key, value] of Object.entries(bookmark) ) {
      if ( value == null ) {
        logger.error(`Missing '${key} in request body`);
        return (
          res
            .status(400)
            .json({
              error: {
                message: `Missing '${key}' in request body`
              }
            })
        );
      }
    };
    
    const knexInst = req.app.get('db');
    BookmarksService
      .addBookmark(
        knexInst,
        bookmark
      )
      .then(bookmark => {
        return (
          res
            .status(201)
            .location(`/bookmarks/${bookmark.id}`)
            .json(serializeBookmark(bookmark))
        );
      })
      .then(() => {
        logger.info(
          `Bookmark with id ${id} created`
        );
      })
      .catch(next);
  });

bookmarksRouter
  .route('/bookmarks/:id')
  .get( (req, res, next) => {
    const knexInst = req.app.get('db');
    BookmarksService
      .getBookmark(knexInst, req.params.id)
      .then(bookmark => {
        if( !bookmark ) {
          return (
            res
              .status(404)
              .json({
                error: {
                  message: `Bookmark with id:${req.params.id} does not exist`
                }
              })
          );
        }
        res.json(bookmark);
      })
      .catch(next);
  })
  .delete( (req, res) => {
    const { id } = req.params;

    const bookmarkIndex = bookmarks.find(bookmark =>
      bookmark.id === id  
    );

    if ( bookmarkIndex === -1 ) {
      logger.error(`Bookmark with id ${id} not found`);
      return (
        res
          .status(404)
          .send(`Resource not found`)
      );
    };

    bookmarks.splice(bookmarkIndex, 1);
    
    logger.info(`Bookmark with id ${id} deleted`);
    
    res
      .status(204)
      .end();
  });

module.exports = bookmarksRouter;