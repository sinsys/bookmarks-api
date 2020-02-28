makeBookmarksArray = () => {
  return (
    [
      {
        id: 1,
        title: 'Google',
        url: 'https://www.google.com/',
        desc: 'Thinkful overview for curriculum',
        rating: 5,
        uuid: '1342d660-0987-4f93-a0e2-1bb7e3ada558'
      },
      {
        id: 2,
        title: 'Thinkful',
        url: 'https://overview.thinkful.com/programs/web-development-flexible/',
        desc: 'Thinkful overview for curriculum',
        rating: 4,
        uuid: 'd1837bbb-aa91-48e1-82ab-fa6f45ea17ab'
      },
      {
        id: 3,
        title: 'NodeJS Docs',
        url: 'https://nodejs.org/dist/latest-v10.x/docs/api/',
        desc: 'Node.js v10.19.0 Documentation',
        rating: 5,
        uuid: '73ac5b3d-ec53-486b-bef6-1dccec2e2baa'
      }
    ]
  );
};

makeMaliciousBookmark = () => {
  const maliciousBookmark = {
    id: 911,
    title: 'Naughty naughty very naughty <script>alert("xss");</script>',
    url: 'https://fake.com',
    desc: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
    rating: 4,
    uuid: '73ac5b3d-ec53-486b-bef6-1dccec2e2baa'
  };
  const expectedBookmark = {
    ...maliciousBookmark,
    title: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    desc: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`
  };
  return {
    maliciousBookmark,
    expectedBookmark,
  };
};

module.exports = {
  makeBookmarksArray,
  makeMaliciousBookmark
};