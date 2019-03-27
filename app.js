 const {MONGODB_URI} = require('./config/db/mongoose');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
 
const admin = require('./routes/admin');
const auth = require('./routes/auth');
const shop = require('./routes/shop');
const {User} = require("./models/user");

const {locals} = require('./middleware/auth-middelware')

const logger = require('morgan');
const path = require('path');
const error = require('./controllers/error')


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger('dev'));

app.set('view engine', 'pug')
app.set('views','views')



app.use(express.static(path.join(__dirname, 'public')));

const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
  });

app.use(
    session({
      secret: 'my secret',
      resave: false,
      saveUninitialized: false,
      store: store
    })
);

app.use((req, res, next) => {
    if (!req.session.user) {
      return next();
    }
    User.findById(req.session.user._id)
      .then(user => {
        if (!user) {
          return next();
        }
        req.user = user;
        next();
      })
      .catch(err => {
        next(new Error(err));
      });
  });


app.use(locals);
// app.use(fetchingUser);
app.use(flash());
// app.use(sassMiddleware({
//     src: path.join(__dirname, 'public/sass'),
//     dest: path.join(__dirname, 'public/stylesheets'),
//     debug: true,
//     indentedSyntax: false, // true = .sass and false = .scss
//     sourceMap: true
//   }));

// app.use((req, res, next) => {
//   res.locals.isAuthenticated = req.session.isLoggedIn;
//   if(req.session.user){
//     res.locals.loggedUserName = req.session.user.name;
//   }
//   next();
// });


// app.use((req, res, next) => {
//   if (!req.session.user) {
//       return next();
//     }
//     User.findById(req.session.user._id)
//       .then(user => {
//         req.user = user;
//         next();
//       })
//       .catch(err => console.log(err));
// });

app.use('/api/admin', admin);
app.use('/', auth);
app.use('/',shop);

app.use(error.get403);
app.use(error.get404);

app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

module.exports = app;