const User = require("../models/user");

exports.getLogin = (req, resp) => {
  resp.render('auth/login', {
    path: '/login',
    docTitle: 'Login',
    isAuthenticated: req.session.loggedIn,
  });
};


exports.postLogin = (req, resp) => {
  // resp.setHeader('Set-Cookie', 'loggedIn=true');
User.findById('5ee68132c92daa048d3c5dd2')
  .then((user) => {
    req.session.loggedIn = true;
    req.session.user = user;
    req.session.save(err => {
      resp.redirect('/');
    })
  })
  .catch((err) => console.log(err));
};


exports.postLogout = (req,resp) => {
  req.session.destroy(err => {
    resp.redirect('/')
  })
}

