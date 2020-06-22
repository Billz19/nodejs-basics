const User = require('../models/user');
const bcrypt = require('bcryptjs');
const EE = require('../utils/email');
exports.getLogin = (req, resp) => {
  let message = req.flash('error');
  if (message.length) {
    message = message[0];
  } else {
    message = null;
  }
  resp.render('auth/login', {
    path: '/login',
    docTitle: 'Login',
    isAuthenticated: false,
    errorMessage: message,
  });
};

exports.postLogin = (req, resp) => {
  // resp.setHeader('Set-Cookie', 'loggedIn=true');
  // User.findById('5ee68132c92daa048d3c5dd2')
  //   .then((user) => {
  //     req.session.loggedIn = true;
  //     req.session.user = user;
  //     req.session.save((err) => {
  //       resp.redirect('/');
  //     });
  //   })
  //   .catch((err) => console.log(err));
  const { email, password } = req.body;
  User.findOne({ email }).then((user) => {
    if (!user) {
      req.flash('error', 'Invalid email !');
      return resp.redirect('/login');
    }
    bcrypt
      .compare(password, user.password)
      .then((doMatch) => {
        if (!doMatch) {
          req.flash('error', 'Wrong password, please try again.');
          return resp.redirect('/login');
        }
        req.session.loggedIn = true;
        req.session.user = user;
        req.session.save((err) => {
          resp.redirect('/');
        });
      })
      .catch((error) => console.log(error));
  });
};

exports.postLogout = (req, resp) => {
  req.session.destroy((err) => {
    resp.redirect('/');
  });
};

exports.getSignup = (req, resp) => {
  let message = req.flash('error');
  if (message.length) {
    message = message[0];
  } else {
    message = null;
  }
  resp.render('auth/signup', {
    path: '/signup',
    docTitle: 'SignUp',
    isAuthenticated: false,
    errorMessage: message,
  });
};

exports.postSignup = (req, resp) => {
  const { email, password, confirmPassword } = req.body;
  User.findOne({ email })
    .then((userDoc) => {
      if (userDoc) {
        req.flash('error', 'E-Mail exists already, please pick another one.');
        return resp.redirect('/signup');
      }
      return bcrypt
        .hash(password, 12)
        .then((genPassword) => {
          const user = new User({
            email,
            password: genPassword,
            cart: { items: [] },
          });
          return user.save();
        })
        .then((result) => {
          resp.redirect('/login');
          // Load account data
          EE.Account.Load().then(function (resp) {
            EE.Email.Send({
              subject: 'SignUp succeeded',
              to: email,
              from: 'lambillo1019@gmail.com',
              replyTo: '19bill@live.com',
              body: 'Well Done!',
              fromName: 'Bill Lam',
              bodyType: 'Plain',
            }).catch((err) => console.log('email', err));
          });
        });
    })
    .catch((error) => console.log(error));
};
