const app = require('../src/app');
const knex = require('knex');
const { makeBookmarksArray } = require('./bookmarks.fixtures');

describe(`Bookmarks Endpoints`, () => {

  let db;

  before(`create db connection`, () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    });
    app.set(
      'db',
      db
    );
  });

  before(`empty 'bookmarks' table`, () => {
    return (
      db('bookmarks')
        .truncate()
    );
  });

  afterEach(`empty 'bookmarks' table`, () => {
    return (
      db('bookmarks')
        .truncate()
    );
  });

  context(`Authorization incorrect/not provided`, () => {

    describe(`GET /bookmarks`, () => {

      it(`responds with 401`, () => {
        return (
          supertest(app)
            .get('/bookmarks')
            .expect(
              401,
              { error: `Unauthorized request` }
            )
        );
      });

    });

    describe(`GET /bookmarks/:id`, () => {
      const bookmarkId = 2;
      it(`responds with 401`, () => {
        return (
          supertest(app)
            .get(`/bookmarks/${bookmarkId}`)
            .expect(
              401,
              { error: `Unauthorized request` }
            )
        );
      });

    });

  });

  context(`Authorization is correct`, () => {

    const authToken = `Bearer ${process.env.API_TOKEN}`;

    context(`Given 'bookmarks' has data`, () => {

      const testBookmarks = makeBookmarksArray();
  
      beforeEach(`seed 'bookmarks' table with test data`, () => {
        return (
          db('bookmarks')
            .insert(testBookmarks)
            .into('bookmarks')
        );
      });
  
      describe(`GET /bookmarks`, () => {
  
        it(`Should resolve 200 with all test bookmarks in an array`, () => {
          return (
            supertest(app)
              .get('/bookmarks')
              .set('Authorization', authToken)
              .expect(
                200,
                testBookmarks
              )
          );
        });
  
      });
 
      describe(`GET /bookmarks/:id`, () => {
  
        it(`Should resolve 200 with only one correct bookmark as an object`, () => {
          const bookmarkId = 2;
          const expected = testBookmarks[bookmarkId - 1];
          return (
            supertest(app)
              .get(`/bookmarks/${bookmarkId}`)
              .set('Authorization', authToken)
              .expect(
                200,
                expected
              )
          );
        });

        it(`Should resolve 404 when bookmark ID doesn't exist`, () => {
          const bookmarkId = 9001;
          return (
            supertest(app)
              .get(`/bookmarks/${bookmarkId}`)
              .set('Authorization', authToken)
              .expect(
                404,
                {
                  error: {
                    message: `Bookmark with id:${bookmarkId} does not exist`
                  }
                }
              )
          );
        });
  
      });

    });

    context(`Given 'bookmarks' is empty`, () => {

      describe(`GET /bookmarks`, () => {
        
        it(`Should resolve 200 with an empty array`, () => {
          return (
            supertest(app)
              .get('/bookmarks')
              .set('Authorization', authToken)
              .expect(
                200,
                []
              )
          );
        });

      });

    });

  });



  after(`terminate db connection`, () => {
    db.destroy();
  });
  
});