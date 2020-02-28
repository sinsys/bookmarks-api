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

    describe(`GET /api/bookmarks`, function() {

      it(`responds with 401`, function() {
        return (
          supertest(app)
            .get('/api/bookmarks')
            .expect(
              401,
              { error: `Unauthorized request` }
            )
        );
      });

    });

    describe(`POST /api/bookmarks`, function() {

      it(`responds with 401`, function() {
        return (
          supertest(app)
            .post('/api/bookmarks')
            .expect(
              401,
              { error: `Unauthorized request` }
            )
        );
      });

    });

    describe(`GET /api/bookmarks/:id`, function() {
      const bookmarkId = 2;
      it(`responds with 401`, function() {
        return (
          supertest(app)
            .get(`/api/bookmarks/${bookmarkId}`)
            .expect(
              401,
              { error: `Unauthorized request` }
            )
        );
      });

    });

    describe(`DELETE /api/bookmarks/:id`, function() {

      it(`responds with 401`, function() {
        return (
          supertest(app)
            .delete('/api/bookmarks')
            .expect(
              401,
              { error: `Unauthorized request` }
            )
        );
      });

    });

    describe(`PATCH /api/bookmarks/:id`, function() {
      const bookmarkId = 2;
      it(`responds with 401`, function() {
        return (
          supertest(app)
            .patch(`/api/bookmarks/${bookmarkId}`)
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
  
      describe(`GET /api/bookmarks`, function() {
  
        it(`Should resolve 200 with all test bookmarks in an array`, function() {
          return (
            supertest(app)
              .get('/api/bookmarks')
              .set('Authorization', authToken)
              .expect(
                200,
                testBookmarks
              )
          );
        });
  
      });
 
      describe(`GET /api/bookmarks/:id`, function() {
  
        it(`Should resolve 200 with only one correct bookmark as an object`, function() {
          const bookmarkId = 2;
          const expected = testBookmarks[bookmarkId - 1];
          return (
            supertest(app)
              .get(`/api/bookmarks/${bookmarkId}`)
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
              .get(`/api/bookmarks/${bookmarkId}`)
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

      describe(`DELETE /api/bookmarks/:id`, function() {
  
        it('Should resolve 204 and remove the bookmark by ID', () => {
          const bookmarkId = 2
          const expectedBookmarks = testBookmarks.filter(bookmark => {
            return (
              bookmark.id !== bookmarkId
            );
          });
          return (
            supertest(app)
            .delete(`/api/bookmarks/${bookmarkId}`)
            .set('Authorization', authToken)
            .expect(204)
            .then(() => {
              return (
                supertest(app)
                  .get(`/api/bookmarks/`)
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
              .delete(`/api/bookmarks/${bookmarkId}`)
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

      describe(`PATCH /api/bookmarks/:id`, function() {

        it(`Should resolve 204 and update the bookmark`, function() {
          const bookmarkId = 2;
          const updatedBookmark = {
            title: 'Updated title',
            url: 'https://updated.url.com',
            desc: 'Updated description...',
            rating: 1
          };
          const expectedBookmark = {
            ...testBookmarks[bookmarkId - 1],
            ...updatedBookmark
          };
          return (
            supertest(app)
              .patch(`/api/bookmarks/${bookmarkId}`)
              .set('Authorization', authToken)
              .send(updatedBookmark)
              .expect(204)
              .then(res => {
                return (
                  supertest(app)
                    .get(`/api/bookmarks/${bookmarkId}`)
                    .set('Authorization', authToken)
                    .expect(expectedBookmark)
                );
              })
          );
        });

        it(`Should resolve 400 when no required fields are supplied`, function() {
          const bookmarkId = 2;
          return (
            supertest(app)
              .patch(`/api/bookmarks/${bookmarkId}`)
              .set('Authorization', authToken)
              .send({ irrelevantField: 'foo'})
              .expect(
                400,
                {
                  error: {
                    message: `Request body must contain either 'title', 'style' or 'content'`
                  }
                }
              )
          );
        });

        it(`Should resolve 204 when updating only a subset of fields`, function() {
          const bookmarkId = 2;
          const updatedBookmark = {
            title: 'Updated title'
          };
          const expectedBookmark = {
            ...testBookmarks[bookmarkId - 1],
            ...updatedBookmark
          };
          return (
            supertest(app)
              .patch(`/api/bookmarks/${bookmarkId}`)
              .set('Authorization', authToken)
              .send({
                ...updatedBookmark,
                fieldToIgnore: `should not be in GET response`
              })
              .expect(204)
              .then(res => {
                return (
                  supertest(app)
                    .get(`/api/bookmarks/${bookmarkId}`)
                    .set('Authorization', authToken)
                    .expect(expectedBookmark)
                );
              })
          );
        });

        it(`Should resolve 404 when bookmark ID doesn't exist`, function() {
          const bookmarkId = 9001;
          return (
            supertest(app)
              .patch(`/api/bookmarks/${bookmarkId}`)
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

      describe(`GET /api/bookmarks`, function() {
        
        it(`Should resolve 200 with an empty array`, function() {
          return (
            supertest(app)
              .get('/api/bookmarks')
              .set('Authorization', authToken)
              .expect(
                200,
                []
              )
          );
        });

      });

      describe(`POST /api/bookmarks`, function() {

        const bookmark = {
          title: 'Test title',
          url: 'https://testurl.com',
          desc: 'Test description',
          rating: 2
        };
  
        it(`creates a bookmark, responding with 201 and the new bookmark`, function() {
          return (
            supertest(app)
              .post('/api/bookmarks')
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
                    .get(`/api/bookmarks/${postRes.body.id}`)
                    .set('Authorization', authToken)
                    .expect(postRes.body)
                );
              })
          );
        });

        context(`When required fields aren't supplied`, function() {

          const requiredFields = [
            'title',
            'url',
            'desc',
            'rating'
          ];
  
          requiredFields
            .forEach(field => {
              const newBookmark = {
                title: 'Test new bookmark',
                url: 'http://newurl.com',
                desc: 'Test new bookmark description...',
                rating: 3
              };
  
              it(`responds with 400 and an error message when the ${field} is missing`, function() {
                delete ( newBookmark[field] );
                return (
                  supertest(app)
                    .post('/api/bookmarks')
                    .set('Authorization', authToken)
                    .send(newBookmark)
                    .expect(
                      400,
                      {
                        error: {
                          message: `Missing '${field}' in request body`
                        }
                      }
                    )
                );
              });
  
            });
  
        });

        context(`Given an XSS attack bookmark`, function() {

          it('removes XSS attack content from response', function() {
            const { 
              maliciousBookmark, 
              expectedBookmark
            } = makeMaliciousBookmark();
            return (
              supertest(app)
                .post(`/api/bookmarks`)
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