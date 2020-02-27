# Bookmarks API

This is an API that can be utilized for the bookmarks client covered earlier in the curriculum.

## Authentication

View the `./src/authenticate.js` file for details to mock authentication for grading.

## Endpoints

  - GET `/bookmark`
    - Returns all bookmarks in our store
  - POST `/bookmark` **This section is pending further dev**
    - Adds a bookmark to our store
    - Expected format for body is JSON:
      - `title`: `string`
      - `url`: `string` (example.com, www.example.com, http(s)://www.example.com)
      - `desc`: `string`
      - `rating`: `number` (1-5 only)
  - GET `/bookmark/:id`
    - Returns a single bookmark
  - DELETE `/bookmark/:id` **This section is pending further dev**
    - Deletes a bookmark from our store

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

  1. Make two new databases, bookmarks and bookmarks-test.
  2. Write the first migration inside the bookmarks-server project that creates the table for bookmarks. Then use the migration to create the tables in both new databases.
    - The table should contain fields for id, title, url, description and rating
    - The description is the only optional field
    - Choose suitable data types for each column
  3. Refactor the GET /bookmarks endpoint and tests. The endpoint should use the database tables.
    - You'll need to wire up Knex into your server and tests.
    - Write a BookmarksService object in the bookmarks-server project that will support CRUD for bookmarks using Knex.
    - You should use fixtures in your tests for the GET /bookmarks and GET /bookmarks/:bookmark_id
    - Write tests for how each endpoint behaves when the database is empty
  4. Write seeding scripts to insert dummy bookmarks into the database tables so you can check that the refactored endpoints work when your server is running locally.