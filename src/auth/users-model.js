'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const users = new mongoose.Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  email: {type: String},
  role: {type: String, required:true, default:'user', enum:['admin','editor','user'] },
});

users.pre('save', function(next) {
  let SALT_ROUNDS = 10;
  bcrypt.hash(this.password, SALT_ROUNDS)
    .then(hashedPassword => {
      this.password = hashedPassword;
      next();
    })
    .catch( error => {throw error;} );
});

/**
 * Queries database by username and then compares password against saved password
 * @param {*} auth
 * @returns User if passwords match
 */
users.statics.authenticateBasic = function(auth) {
  let query = {username:auth.username};
  return this.findOne(query)
    .then( user => {
      return user ? user.comparePassword( auth.password ) : false;
    })
    .catch(console.error);
};

/**
 * Compare a plain text password against the hashed one we have saved
 * @param {*} password
 * @returns User if passwords match, otherwise null
 */
users.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.password)
    .then( isPasswordValid => isPasswordValid ? this : null );
};

/**
 * Generate a JWT from the user id and a secret
 * @returns jsonwebtoken
 */
users.methods.generateToken = function() {
  let tokenData = {
    id : this._id,
    capabilities: [],
  };
  return jwt.sign( tokenData, process.env.SECRET || '12345' );
};

module.exports = mongoose.model('users', users);
