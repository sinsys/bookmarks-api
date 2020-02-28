# Bookmarks API

This is an API that can be utilized for the bookmarks client covered earlier in the curriculum.

## Authentication

View the `./src/authenticate.js` file for details to mock authentication for grading.

## Endpoints

  - GET `/api/bookmarks`
    - Returns all bookmarks in our database
  - POST `/api/bookmarks`
    - Adds a bookmark to our database
    - Expected format for body is JSON:
      - `title`: `string`
      - `url`: `string` (example.com, www.example.com, http(s)://www.example.com)
      - `desc`: `string`
      - `rating`: `number` (1-5 only)
  - GET `/api/bookmarks/:id`
    - Returns a single bookmark
  - DELETE `/api/bookmarks/:id`
    - Deletes a bookmark from our database
  - PATCH `/api/bookmarks/:id`
    - Updates an existing bookmark

## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests `npm test`

Run tests and continue watching `npm watch`

## Noted Alterations

  - `bookmarks-server` has been renamed to `bookmarks-api`
  - `description` has been renamed to `desc` for bookmark entries
  - 
## Requirements

### Checkpoint 10
  1. Use the boilerplate to start a new application named bookmarks-server
  2. Configure logging and API key handling middleware on the server
  3. Write a route handler for the endpoint GET /api/bookmarks that returns a list of bookmarks
  4. Write a route handler for the endpoint GET /api/bookmarks/:id that returns a single bookmark with the given ID, return 404 Not Found if the ID is not valid
  5. Write a route handler for POST /api/bookmarks that accepts a JSON object representing a bookmark and adds it to the list of bookmarks after validation.
  6. Write a route handler for the endpoint DELETE /api/bookmarks/:id that deletes the bookmark with the given ID.

### Checkpoint 15
  1. Make two new databases, bookmarks and bookmarks-test.
  2. Write the first migration inside the bookmarks-server project that creates the table for bookmarks. Then use the migration to create the tables in both new databases.
      - The table should contain fields for id, title, url, description and rating
      - The description is the only optional field
      - Choose suitable data types for each column
  3. Refactor the GET /api/bookmarks endpoint and tests. The endpoint should use the database tables.
      - You'll need to wire up Knex into your server and tests.
      - Write a BookmarksService object in the bookmarks-server project that will support CRUD for bookmarks using Knex.
      - You should use fixtures in your tests for the GET /api/bookmarks and GET /api/bookmarks/:bookmark_id
      - Write tests for how each endpoint behaves when the database is empty
  4. Write seeding scripts to insert dummy bookmarks into the database tables so you can check that the refactored endpoints work when your server is running locally.

### Checkpoint 16
  1. Refactor your POST handler to support inserting bookmarks into the database.
      - Refactor or implement the integration tests for POSTing bookmarks as well as making sure appropriate responses get sanitized.
      - You should also test that your POST /api/bookmarks endpoint validates each bookmark to have the required fields in valid formats. For example, rating should be a number between 1 and 5.
      - If your POST endpoint responds with the newly created bookmark, make sure that appropriate fields get sanitized.
  2. Refactor your DELETE handler to support removing bookmarks from the database.
      - Refactor or implement the integration tests for DELETEing bookmarks as well as making sure the DELETE responds with a 404 when the bookmark doesn't exist.
  3. Refactor your GET methods and tests to ensure that all bookmarks get sanitized.