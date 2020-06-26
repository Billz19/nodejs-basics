const express = require('express');
const { body, check } = require('express-validator');
const {
  getLogin,
  postLogin,
  postLogout,
  getSignup,
  postSignup,
  getReset,
  postReset,
  getNewPass,
  postNewPass,
} = require('../controllers/auth');
const {
  signupValidator,
  loginValidator,
} = require('../validators/authValidator');

const router = express.Router();

router.get('/login', getLogin);

router.post('/login', loginValidator(), postLogin);

router.post('/logout', postLogout);

router.get('/signup', getSignup);

router.post('/signup', signupValidator(), postSignup);

router.get('/reset', getReset);

router.post('/reset', postReset);

router.get('/reset/:token', getNewPass);

router.post('/new_pass', postNewPass);

module.exports = router;
