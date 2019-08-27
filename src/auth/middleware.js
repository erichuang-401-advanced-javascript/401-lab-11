'use strict';

const User = require('./users-model.js');

/**
 * Authenticates
 * @param {*} request
 * @param {*} response
 * @param {*} next
 * @returns request object to next handler with authenticated user info on request object
 */
module.exports = (request, response, next) => {

  try {

    let [ authType, encodedString ] = request.headers.authorization.split(/\s+/);

    // BASIC Auth  ... Authorization:Basic ZnJlZDpzYW1wbGU=

    switch(authType.toLowerCase()) {
    case 'basic':
      return _authBasic(encodedString);
    default:
      return _authError();
    }

  } catch(e) {
    return _authError();
  }

  /**
   * Parses out user and password and sends both to user.authenticateBasic
   * @param {*} authString
   * @returns the return from User.authenticateBasic
   */
  function _authBasic( authString ) {
    let decodedString = Buffer.from( authString,'base64' ).toString(); // <Buffer 01 02...>
    let [username,password] = decodedString.split(':'); // variables username="john" and password="mysecret"
    let auth = { username,password }; // {username:"john", password:"mysecret"}

    return User.authenticateBasic(auth)
      .then( user => _authenticate(user) );
  }

  /**
   * If user is authenticated, adds user and token to request object
   * @param {*} user
   * @returns nothing, passes control to next function
   */
  function _authenticate(user) {
    if ( user ) {
      request.user = user;
      request.token = user.generateToken();
      next();
    }
    else {
      return _authError();
    }
  }

  /**
   * Error handler
   */
  function _authError() {
    next({status: 401, statusMessage: 'Unauthorized', message: 'Invalid User ID/Password'});
  }

};

