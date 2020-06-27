// const http = require('http');
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const MONGODB_URI = 'mongodb://localhost:27017/shop';
// const { mongoConnect } = require('./utils/database');
const app = express();
const errorController = require('./controllers/error');
// const sequelize = require('./utils/database');
const adminRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');
const authRouter = require('./routes/auth');
const User = require('./models/user');
const { connect } = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrfProtection = require('csurf')();
const flash = require('connect-flash');
app.set('view engine', 'pug');
// app.set('view engine','ejs')
app.set('views', 'views');

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions',
});

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(cookieParser());
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use(csrfProtection);
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, resp, next) => {
  resp.locals.isAuthenticated = req.session.loggedIn;
  resp.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, resp, next) => {
  if (!req.session.user) return next();
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) return next();
      req.user = user;
      next();
    })
    .catch((err) => {
       next(new Error(err));
    });
});
app.use('/admin', adminRouter);
app.use(shopRouter);
app.use(authRouter);

app.get('/500',errorController.get500)
app.use(errorController.get404);
app.use((error,req,resp,next)=>{
  resp.status(500).render('errors/500', {
    docTitle: 'Error!',
    path: '/500',
  });
})
// http.createServer(app).listen(3030);

// sequelize
//   // .sync({force: true})
//   .sync()
//   .then((res) => {
//     return User.findByPk('1');
//   })
//   .then((user) => {
//     if (!user) {
//       return User.create({ name: 'Bill', email: 'bill@test.com' });
//     }
//     return user;
//   })
//   .then((user) => {
//     user.getCart().then(cart=> {
//       if (!cart){
//         return user.createCart();
//       }
//       return cart
//     })
//   })
//   .then(() => {
//     app.listen(3030);
//   })
//   .catch((err) => console.log(err));

// mongoConnect()
//   .then(() => {
//     console.log('Connected');
//     app.listen(3030);
//   })
//   .catch((error) => {
//     console.log('Failed');
//     throw error;
//   });

connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected');
    // User.findOne().then((user) => {
    //   if (!user) {
    //     new User({
    //       name: 'Bill Lam',
    //       email: 'bill@lam.com',
    //       cart: {
    //         items: [],
    //       },
    //     }).save();
    //   }
    // });
    app.listen(3030);
  })
  .catch((error) => console.log('Error'));
