// const http = require('http');
const dotenv = require('dotenv');
dotenv.config();
const https = require('https');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
// const MONGODB_URI = 'mongodb://localhost:27017/shop';
const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0-fedsh.gcp.mongodb.net/${process.env.MONGO_DEFAULT_DB}?retryWrites=true&w=majority`;
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
const multer = require('multer');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const { createWriteStream, readFileSync } = require('fs');
const storageOptions = multer.diskStorage({
  destination(req,file,callback){
    callback(null,'images/')
  },
  filename(req,file,callback){
    callback(null, file.originalname);
  }
});
const fileFilter = (req,file,callback)=>{
 const regex = new RegExp(/image\/(png|jpg|jpeg)/);
  if (regex.test(file.mimetype)) {
    callback(null, true);
  } else {
    callback(null, false);
  }
}
app.set('view engine', 'pug');
// app.set('view engine','ejs')
app.set('views', 'views');

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions',
});

// const privateKey = readFileSync('server.key');
// const certificate = readFileSync('server.cert');

const logStream = createWriteStream(path.join(__dirname,'access.log'),{flags:'a'})

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.use(
  multer({storage: storageOptions,fileFilter}).single('image')
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
app.use('/images',express.static(path.join(__dirname, 'images')));

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

app.use(helmet());

app.use(compression())

app.use(morgan('combined',{stream: logStream}))

app.get('/500',errorController.get500)
app.use(errorController.get404);
app.use((error,req,resp,next)=>{
      console.log(error);
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
    // console.log('Connected');
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

    // https.createServer({key: privateKey,cert: certificate},app).listen(3030);
    app.listen(3030);
  })
  .catch((error) => console.log('Error'));
