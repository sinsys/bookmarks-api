const logger = require('./logger');

validateBearerToken = (req, res, next) => {
  /* 

  This is how it would function normally

  const apiToken = process.env.API_TOKEN;

  To not expose my real secret .env key, 
  I've created a dummy key to utilize for
  authentication for the grading team.
    
    Please add the header: 
      Authorization: Bearer 1234567890abcdef 
    to your requests for access 

  */
  // const apiToken = `1234567890abcdef`;
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get('Authorization');

  if ( 
    !authToken ||
    authToken
      .split(' ')[1] !== apiToken
  ) {
    logger
      .error(`Unauthorized request to path: ${req.path}`);
      return (
        res
          .status(401)
          .json({
            error: `Unauthorized request`
          })
      );
  };

  next();

};

module.exports = {
  validateBearerToken
};