const express = require('express');
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

const router = express.Router();

router.get('/login', getLogin);

router.post('/login', postLogin);

router.post('/logout', postLogout);

router.get('/signup', getSignup);

router.post('/signup', postSignup);

router.get('/reset', getReset);

router.post('/reset', postReset);

router.get('/reset/:token', getNewPass);

router.post('/new_pass', postNewPass);

module.exports = router;
