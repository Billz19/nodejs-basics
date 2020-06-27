exports.get404 = (req, resp, next) => {
  resp
    .status(404)
    .render('errors/404', { docTitle: '404 Not Found', path: '/404' });
};

exports.get500 = (req, resp) => {
  resp.status(500).render('errors/500', {
    docTitle: 'Error!',
    path: '/500',
  });
};
