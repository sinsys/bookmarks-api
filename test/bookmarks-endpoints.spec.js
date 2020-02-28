const app = require('../src/app');
const knex = require('knex');
const { 
  makeBookmarksArray, 
  makeMaliciousBookmark 
} = require('./bookmarks.fixtures');

describe(`Bookmarks Endpoints`, function() {

  let db;

  before(`create db connection`, function() {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    });
    app.set(
      'db',
      db
    );
  });

  before(`empty 'bookmarks' table`, function() {
    return (
      db('bookmarks')
        .truncate()
    );
  });

  afterEach(`empty 'bookmarks' table`, function() {
    return (
      db('bookmarks')
        .truncate()
    );
  });

  context(`Authorization incorrect/not provided`, function() {

    describe(`GET /bookmarks`, function() {

      it(`responds with 401`, function() {
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

    describe(`POST /bookmarks`, function() {

      it(`responds with 401`, function() {
        return (
          supertest(app)
            .post('/bookmarks')
            .expect(
              401,
              { error: `Unauthorized request` }
            )
        );
      });

    });

    describe(`GET /bookmarks/:id`, function() {
      const bookmarkId = 2;
      it(`responds with 401`, function() {
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

    describe(`DELETE /bookmarks/:id`, function() {

      it(`responds with 401`, function() {
        return (
          supertest(app)
            .post('/bookmarks')
            .expect(
              401,
              { error: `Unauthorized request` }
            )
        );
      });

    });

  });

  context(`Authorization is correct`, function() {

    const authToken = `Bearer ${process.env.API_TOKEN}`;

    context(`Given 'bookmarks' has data`, function() {

      const testBookmarks = makeBookmarksArray();
  
      beforeEach(`seed 'bookmarks' table with test data`, function() {
        return (
          db('bookmarks')
            .insert(testBookmarks)
            .into('bookmarks')
        );
      });
  
      describe(`GET /bookmarks`, function() {
  
        it(`Should resolve 200 with all test bookmarks in an array`, function() {
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
 
      describe(`GET /bookmarks/:id`, function() {
  
        it(`Should resolve 200 with only one correct bookmark as an object`, function() {
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

        it(`Should resolve 404 when bookmark ID doesn't exist`, function() {
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

      describe(`DELETE /bookmarks/:id`, function() {
  
        it('Should resolve 204 and remove the bookmark by ID', () => {
          const bookmarkId = 2
          const expectedBookmarks = testBookmarks.filter(bookmark => {
            return (
              bookmark.id !== bookmarkId
            );
          });
          return (
            supertest(app)
            .delete(`/bookmarks/${bookmarkId}`)
            .set('Authorization', authToken)
            .expect(204)
            .then(() => {
              return (
                supertest(app)
                  .get(`/bookmarks`)
                  .set('Authorization', authToken)
                  .expect(expectedBookmarks)
              )
            })
          );
        });

        it(`Should resolve 404 when bookmark ID doesn't exist`, function() {
          const bookmarkId = 9001;
          return (
            supertest(app)
              .delete(`/bookmarks/${bookmarkId}`)
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

    context(`Given 'bookmarks' is empty`, function() {

      describe(`GET /bookmarks`, function() {
        
        it(`Should resolve 200 with an empty array`, function() {
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

      describe(`POST /bookmarks`, function() {

        const bookmark = {
          title: 'Test title',
          url: 'https://testurl.com',
          desc: 'Test description',
          rating: 2
        };
  
        it(`creates a bookmark, responding with 201 and the new bookmark`, function() {
          return (
            supertest(app)
              .post('/bookmarks')
              .set('Authorization', authToken)
              .send(bookmark)
              .expect(201)
              .expect(res => {
                expect(res.body.title)
                  .to.eql(bookmark.title);
                expect(res.body.url)
                  .to.eql(bookmark.url);
                expect(res.body.desc)
                  .to.eql(bookmark.desc)
                expect(res.body.rating)
                  .to.eql(bookmark.rating)
              })
              .then(postRes => {
                return (
                  supertest(app)
                    .get(`/bookmarks/${postRes.body.id}`)
                    .set('Authorization', authToken)
                    .expect(postRes.body)
                );
              })
          );
        });

        context(`Given an XSS attack bookmark`, function() {

          it('removes XSS attack content from response', function() {
            const { 
              maliciousBookmark, 
              expectedBookmark
            } = makeMaliciousBookmark();
            return (
              supertest(app)
                .post(`/bookmarks`)
                .set('Authorization', authToken)
                .send(maliciousBookmark)
                .expect(201)
                .expect(res => {
                  expect(res.body.title)
                    .to.eql(expectedBookmark.title);
                  expect(res.body.desc)
                    .to.eql(expectedBookmark.desc);
              })
            );
          });
  
        });

      });

    });

  });

  after(`terminate db connection`, function() {
    db.destroy();
  });
  
});