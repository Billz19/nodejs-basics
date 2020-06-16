exports.get404 = (req, resp, next) => {
  resp
    .status(404)
    .render('page_error', { docTitle: '404 Not Found', path: '/404' });
};
