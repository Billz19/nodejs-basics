const User = require('../models/user');
const bcrypt = require('bcryptjs');
const EE = require('../utils/email');
const crypto = require('crypto');
const NodemailerTransporter = require('../utils/email');
const { validationResult } = require('express-validator');
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
    oldInput: {
      email: '',
      password: '',
    },
    validationErrors: [],
  });
};

exports.postLogin = (req, resp) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return resp.status(422).render('auth/login', {
      docTitle: 'Login',
      path: '/login',
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email,
        password,
      },
      validationErrors: errors.array(),
    });
  }
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
  User.findOne({ email }).then((user) => {
    if (!user) {
      return resp.status(422).render('auth/login', {
        docTitle: 'Login',
        path: '/login',
        errorMessage: 'Invalid email !',
        oldInput: {
          email,
          password,
        },
        validationErrors: [],
      });
    }
    bcrypt
      .compare(password, user.password)
      .then((doMatch) => {
        if (!doMatch) {
          return resp.status(422).render('auth/login', {
            docTitle: 'Login',
            path: '/login',
            errorMessage: 'Wrong password, please try again.',
            oldInput: {
              email,
              password,
            },
            validationErrors: [],
          });
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
    oldInput: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationErrors: [],
  });
};

exports.postSignup = (req, resp) => {
  const errors = validationResult(req);
  const { email, password, confirmPassword } = req.body;
  if (!errors.isEmpty()) {
    return resp.status(422).render('auth/signup', {
      path: '/signup',
      docTitle: 'SignUp',
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email,
        password,
        confirmPassword,
      },
      validationErrors: errors.array(),
    });
  }
  // return resp.redirect('/');
  // User.findOne({ email })
  //   .then((userDoc) => {
  //     if (userDoc) {
  //       req.flash('error', 'E-Mail exists already, please pick another one.');
  //       return resp.redirect('/signup');
  //     }
  // return bcrypt
  bcrypt
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
      NodemailerTransporter.sendMail(
        {
          from: process.env.GMAIL_ACCOUNT,
          to: email,
          subject: 'SignUp succeeded',
          text: 'Well done !',
        },
        (err, info) => {
          if (err) {
            console.log('error mail', err);
          }
          if (info) {
            console.log('info mail', info);
          }
        }
      );
    })
    .catch((error) => console.log(error));
  // })
  // .catch((error) => console.log(error));
};

exports.getReset = (req, resp) => {
  let message = req.flash('error');
  if (message.length) {
    message = message[0];
  } else {
    message = null;
  }
  resp.render('auth/reset', {
    path: '/reset',
    docTitle: 'Reset Password',
  });
};

exports.postReset = (req, resp) => {
  const { email } = req.body;
  crypto.randomBytes(32, (err, buf) => {
    if (err) {
      console.log(err);
      return resp.redirect('/reset');
    }
    const token = buf.toString('hex');
    User.findOne({ email })
      .then((user) => {
        if (!user) {
          req.flash('error', 'Account not founded to this email, try again!');
          return resp.redirect('/reset');
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then(() => {
        resp.redirect('/');
        NodemailerTransporter.sendMail(
          {
            from: process.env.GMAIL_ACCOUNT,
            to: email,
            subject: 'Password Reset',
            html: `
          <p>You requested a password reset</p>
          <p>Click this <a href="http://localhost:3030/reset/${token}">link</a> to set a new password</p>
          `,
          },
          (err, info) => {
            if (err) {
              console.log('error mail', err);
            }
            if (info) {
              console.log('info mail', info);
            }
          }
        );
      })
      .catch((error) => console.log(error));
  });
};

exports.getNewPass = (req, resp) => {
  const { token } = req.params;
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then((user) => {
      if (!user) {
        return resp.redirect('/');
      }
      let message = req.flash('error');
      if (message.length) {
        message = message[0];
      } else {
        message = null;
      }
      resp.render('auth/new_pass', {
        docTitle: 'New Password',
        path: '/login',
        message,
        userId: user._id.toString(),
        passwordToken: token,
      });
    })
    .catch((error) => console.log(error));
};

exports.postNewPass = (req, resp) => {
  const { password, id, token } = req.body;
  let resetUser;
  User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
    _id: id,
  })
    .then((user) => {
      if (!user) {
        return resp.redirect('/');
      }
      resetUser = user;
      return bcrypt.hash(password, 12);
    })
    .then((hashedPassword) => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then((result) => {
      resp.redirect('/login');
    })
    .catch((error) => console.log(error));
};
