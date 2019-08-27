'use strict';

/**
 * Handles unknown routes. Sends response with 404 error.
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
// eslint-disable-next-line no-unused-vars
module.exports = (req,res,next) => {
  let error = { error: 'Resource Not Found' };
  res.statusCode = 404;
  res.statusMessage = 'Not Found';
  res.setHeader('Content-Type', 'application/json');
  res.write(JSON.stringify(error));
  res.end();
};
