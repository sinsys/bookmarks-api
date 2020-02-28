const express = require('express');
const { uuid } = require('uuidv4');
const { isWebUri } = require('valid-url');
const logger = require('../logger');
const xss = require('xss');

const bodyParser = express.json();
const bookmarksRouter = express.Router();
const BookmarksService = require('./bookmarks-service');

serializeBookmark = (bookmark) => {
  return ({
    ...bookmark,
    title: xss(bookmark.title),
    desc: xss(bookmark.desc),
    rating: Number(bookmark.rating)
  });
};

bookmarksRouter
  .route('/bookmarks')
  .get( (req, res, next) => {
    const knexInst = req.app.get('db');
    BookmarksService
      .getAll(knexInst)
      .then(bookmarks => {
        bookmarks.forEach(bookmark => {
          return (
            serializeBookmark(bookmark)
          );
        })
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
    } = serializeBookmark(req.body);

    const bookmark = {
      title,
      url,
      desc,
      rating,
      uuid: uuid(),
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

    if ( 
      !Number.isInteger(rating) ||
      rating < 1 ||
      rating > 5
    ) {
      logger.error(`Invalid rating '${rating}' supplied`)
      return (
        res
          .status(400)
          .send({
            error: {
              message: `'rating' must be a number between 1 and 5`
            }
          })
      );
    };

    if ( !isWebUri(url) ) {
      logger.error(`Invalid url '${url}' supplied`)
      return (
        res
          .status(400)
          .send({
            error: { 
              message: `'url' must be a valid URL` 
            }
          })
      );
    }  

    const knexInst = req.app.get('db');

    BookmarksService
      .addBookmark(
        knexInst,
        bookmark
      )
      .then(bookmark => {
        logger.info(
          `Bookmark with id ${bookmark.id} created`
        );
        return (
          res
            .status(201)
            .location(`/bookmarks/${bookmark.id}`)
            .json(serializeBookmark(bookmark))
        );
      })
      .catch(next);
  });

bookmarksRouter
  .route('/bookmarks/:id')
  .all( (req, res, next) => {
    const knexInst = req.app.get('db');
    const id = req.params.id;
    BookmarksService
      .getBookmark(
        knexInst,
        id
      )
      .then(bookmark => {
        if ( !bookmark ) {
          return (
            res
              .status(404)
              .json({
                error: {
                  message: `Bookmark with id:${id} does not exist`
                }
              })
          );
        };
        res.bookmark = bookmark;
        next();
      })
      .catch(next);
  })
  .get( (req, res, next) => {
    return (
      res
        .json(serializeBookmark(res.bookmark))
    );
  })
  .delete( (req, res, next) => {
    const knexInst = req.app.get('db');
    const { id } = req.params;
    BookmarksService
      .deleteBookmark(
        knexInst,
        id
      )
      .then(rowsAffected => {
        logger.info(`Bookmark with id ${id} deleted`)
        return (
          res
            .status(204)
            .end()
        );
      })
      .catch(next);
  });

module.exports = bookmarksRouter;