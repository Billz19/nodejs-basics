const { check, body } = require('express-validator');
const User = require('../models/user');

exports.signupValidator = () => {
  return [
    check('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value, { req }) => {
        // if (value === '19bill@live.com') {
        //   throw new Error('this address is forbidden');
        // }
        // return true;
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject(
              'E-Mail exists already, please pick another one.'
            );
          }
        });
      }).normalizeEmail(),
    body(
      'password',
      'Please enter an alphanumeric password with min length of 5 character at least '
    )
      .isLength({ min: 5 })
      .matches(/\d/).trim(),
    body('confirmPassword').trim().custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords have to match!');
      }
      return true;
    }),
  ];
};


exports.loginValidator = () => [
  body('email').isEmail().withMessage('Please enter a valid email address.').normalizeEmail(),
  body('password', 'Password has to be valid.')
    .isLength({ min: 5 })
    .matches(/\d/).trim(),
];