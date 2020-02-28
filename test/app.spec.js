require('dotenv').config();
const app = require('../src/app');
const authToken = `Bearer ${process.env.API_TOKEN}`;

describe('App', () => {

  context(`Authorization correct`, () => {

    describe(`GET /`, () => {

      it('responds with 200', () => {
        return (
          supertest(app)
            .get('/')
            .set('Authorization', authToken)
            .expect(
              200, 
              {
                status: 'Server is up'
              }
            )
        );
      });

    });

  });

  context(`Authorization incorrect`, () => {

    describe(`GET /`, () => {

      it(`responds with 401`, () => {
        return (
          supertest(app)
            .get('/')
            .expect(
              401,
              { error: `Unauthorized request` }
            )
        );
      });

    });

  });

});