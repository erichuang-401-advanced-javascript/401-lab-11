'use strict';

const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const auth = require('../auth/middleware');

router.get('/books', auth, handleGetAll);
router.get('/books/:id', auth, handleGetOne);

// Route Handlers
/**
 * Route handler for retrieving all books.
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
// eslint-disable-next-line no-unused-vars
function handleGetAll(req, res, next) {
  let books = {
    count: 3,
    results: [
      { title:'Moby Dick' },
      { title:'Little Women' },
      { title: 'Eloquent Javascript' },
    ],
  };
  res.status(200).json(books);
}

/**
 * Route handler for retrieving one book.
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
// eslint-disable-next-line no-unused-vars
function handleGetOne(req, res, next) {
  let book = {
    title:'Moby Dick',
  };
  res.status(200).json(book);
}

module.exports = router;
