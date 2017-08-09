var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var session = require('express-session');

var app = express();
var sql = require('mssql');
var config = {
  user: 'mstokes',
  domain: 'ampcorp',
  password: 'Gr33ngiant',
  server: 'am01sql003.ampcorp.org',
  database: 'WarehouseMgt'
};

sql.connect(config, function (err) {
  console.log(err);
});

var port = process.env.PORT || 5000;
var nav = [{
    Link:'/Books',
    Text:'Book'
  },{
    Link:'/Authors',
    Text:'Author'
  }];
var bookRouter = require('./src/routes/bookRoutes')(nav);
var adminRouter = require('./src/routes/adminRoutes')(nav);
var authRouter = require('./src/routes/authRoutes')(nav);

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(session({secret: 'library', resave: true, saveUninitialized: true}));

require('./src/config/passport')(app);

app.use('/Books', bookRouter);
app.use('/Admin', adminRouter);
app.use('/Auth', authRouter);

app.set('views', './src/views');
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  res.render('index', {
    title: 'Library Home',
    nav: nav
  });
});

app.listen(port, function(err) {
  console.log('running server on port ' + port);
});
