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
  }

};

module.exports = BookmarksService;