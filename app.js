// const http = require('http');
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
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, resp, next) => {
  // User.findByPk('5ee144b589c2f83b37e8e432')
  // User.findById('5ee68132c92daa048d3c5dd2')
  if (!req.session.user) return next()
    User.findById(req.session.user._id)
      .then((user) => {
        req.user = user;
        // req.user = new User(user.name, user.email, user.cart, user._id);
        next();
      })
      .catch((err) => console.log(err));
});
app.use('/admin', adminRouter);
app.use(shopRouter);
app.use(authRouter);

app.use(errorController.get404);
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
    User.findOne().then((user) => {
      if (!user) {
        new User({
          name: 'Bill Lam',
          email: 'bill@lam.com',
          cart: {
            items: [],
          },
        }).save();
      }
    });
    app.listen(3030);
  })
  .catch((error) => console.log('Error'));
