var express = require('express');
var bookRouter = express.Router();
var sql = require('mssql');

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
      var request = new sql.Request();

      request.query('select top 5 row_number() over (order by name) as [id], Name as [title], company as [author] from COMPANY where ACTIVE = \'Y\'',
                    function(err, recordset) {
                        //console.log(recordset.recordset);
                        //console.log(books);
                        res.render('bookListView', {
                          title: 'Books',
                          nav: nav,
                          books: recordset.recordset
                        });
                      });

    });

  bookRouter.route('/:author')
    //this gives us whatever is beyond the ":"
    //so if a user enters /books/X this function will return X
    .get(function (req, res) {
      var author = req.params.author;
      var ps = new sql.PreparedStatement();
      ps.input('author', sql.NVarChar);
      ps.prepare('select top 5 row_number() over (order by name) as [id], Name as [title], company as [author] from COMPANY where ACTIVE = \'Y\' and company = @author',
        function(err) {
          ps.execute({author:req.params.author},
            function(err, recordset) {  //should this be recordset.recordset?  no pulling back the entire set
              res.render('bookView', {
                title: 'Books',
                nav: nav,
                book: recordset.recordset[0] // this is where we use recordset.recordset because we just want the inner recordset
              });
            });
        });
      //req.params.id gives us access to X and we are passing it to "id"
    });

  return bookRouter;
};

module.exports = router;
