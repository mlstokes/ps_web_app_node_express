var express = require('express');
var bookRouter = express.Router();
var sql = require('mssql');
var mongodb = require('mongodb').MongoClient;

var router = function(nav) {

  bookRouter.route('/')
    .get(function (req, res) {
      var url =
        'mongodb://localhost:27017/libraryApp';

      mongodb.connect(url, function (err, db) {
        var collection = db.collection('books');

        collection.find({}).toArray(
          function (err, results) {
            res.render('bookListView', {
                title: 'Books',
                nav: nav,
                books: results
              });
          });
      });

      //var request = new sql.Request();

      // request.query('select top 5 row_number() over (order by name) as [id], Name as [title], company as [author] from COMPANY where ACTIVE = \'Y\'',
      //               function(err, recordset) {
      //                   //console.log(recordset.recordset);
      //                   //console.log(books);
      //                   res.render('bookListView', {
      //                     title: 'Books',
      //                     nav: nav,
      //                     books: recordset.recordset
      //                   });
      //                 });

    });

  bookRouter.route('/:author')
    //this gives us whatever is beyond the ":"
    //so if a user enters /books/X this function will return X
    .all(function (req, res, next) {
          var author = req.params.author;
          var ps = new sql.PreparedStatement();
          ps.input('author', sql.NVarChar);
          ps.prepare('select top 5 row_number() over (order by name) as [id], Name as [title], company as [author] from COMPANY where ACTIVE = \'Y\' and company = @author',
        function(err) {
            ps.execute({author:req.params.author},
            function(err, recordset) {  //should this be recordset.recordset?  no pulling back the entire set
              if (recordset.recordset.length === 0) {
                res.status(404).send('Not Found');
              } else {
                req.book = recordset.recordset[0]; // this is where we use recordset.recordset because we just want the inner recordset
                next();
              }

            });
          });
        })
    .get(function (req, res) {
      res.render('bookView', {
        title: 'Books',
        nav: nav,
        book: req.book
      });
    });

  return bookRouter;
};

module.exports = router;
