makeBookmarksArray = () => {
  return (
    [
      {
        id: 1,
        title: 'Google',
        url: 'https://www.google.com/',
        desc: 'Thinkful overview for curriculum',
        rating: 5
      },
      {
        id: 2,
        title: 'Thinkful',
        url: 'https://overview.thinkful.com/programs/web-development-flexible/',
        desc: 'Thinkful overview for curriculum',
        rating: 4
      },
      {
        id: 3,
        title: 'NodeJS Docs',
        url: 'https://nodejs.org/dist/latest-v10.x/docs/api/',
        desc: 'Node.js v10.19.0 Documentation',
        rating: 5
      }
    ]
  );
};

module.exports = {
  makeBookmarksArray
};