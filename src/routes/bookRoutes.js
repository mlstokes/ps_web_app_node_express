var express = require('express');

var bookRouter = express.Router();

var router = function(nav) {
  var books = [
  {
    title: 'War & Peace',
    genre: 'Historical Fiction',
    author: 'Lev Nikolayevich Tolstoy',
    read: false
  },
  {
    title: 'Les Miserables',
    genre: 'Historical Fiction',
    author: 'Victor Hugo',
    read: false
  },
  {
    title: 'A Journey into the Center of the Earth',
    genre: 'Science Fiction',
    author: 'Jules Verne',
    read: false
  }
];

  bookRouter.route('/')
    .get(function (req, res) {
    res.render('bookListView', {
      title: 'Books',
      nav: nav,
      books: books
    });
  });

  bookRouter.route('/:id')
    //this gives us whatever is beyond the ":"
    //so if a user enters /books/X this function will return X
    .get(function (req, res) {
    var id = req.params.id;
    //req.params.id gives us access to X and we are passing it to "id"
    res.render('bookView', {
      title: 'Books',
      nav: nav,
      book: books[id]
    });
  });

  return bookRouter;
};

module.exports = router;
