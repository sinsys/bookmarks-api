const BookmarksService = {

  getAll(knex) {
    return (
      knex
        .select('*')
        .from('bookmarks')
    );
  },

  getBookmark(knex, id) {
    return (
      knex
        .select('*')
        .from('bookmarks')
        .where(
          'id',
          id
        )
        .first()
    );
  },

  addBookmark(knex, bookmark) {
    return (
      knex
        .insert(bookmark)
        .into('bookmarks')
        .returning('*')
        .then(bookmarks => {
          return (
            bookmarks[0]
          );
        })
    );
  },

  updateBookmark(knex, id, newFields) {
    return (
      knex('bookmarks')
        .where( { id } )
        .update( newFields )
    );
  },

  deleteBookmark(knex, id) {
    return (
      knex('bookmarks')
        .where( { id } )
        .delete()
    );
  }

};

module.exports = BookmarksService;