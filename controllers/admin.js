const Product = require('../models/product');
exports.getAddProduct = (req, resp, next) => {
  resp.render('admin/edit_product', {
    docTitle: 'Add Product',
    path: '/add_product',
    editing: false,
    isAuthenticated: req.session.loggedIn,
  });
};

exports.getProducts = (req, resp) => {
  Product.find({ userId: req.user._id }).then((products) => {
    resp.render('admin/products', {
      prods: products,
      docTitle: 'Admin Products',
      path: '/admin_prods',
      isAuthenticated: req.session.loggedIn,
    });
  });
  // Product.fetchAll().then((products) => {
  //   resp.render('admin/products', {
  //     prods: products,
  //     docTitle: 'Admin Products',
  //     path: '/admin_prods',
  //   });
  // });
  // Product.findAll().then((products) => {
  // req.user.getProducts().then((products) => {
  //   resp.render('admin/products', {
  //     prods: products,
  //     docTitle: 'Admin Products',
  //     path: '/admin_prods',
  //   });
  // });
  // Product.fetchAll().then((p) => {
  //   const products = p;
  //   resp.render('admin/products', {
  //     prods: products,
  //     docTitle: 'Admin Products',
  //     path: '/admin_prods',
  //   });
  // });
};

exports.postAddProduct = (req, resp, next) => {
  // const objParam = {... req.body, userId: req.user._id}
  const objParam = { ...req.body, userId: req.user };
  const product = new Product(objParam);
  product
    .save()
    .then(() => resp.redirect('/admin/products'))
    .catch((err) => console.log(err));

  // const { title, imageUrl, description, price } = req.body;
  // const product = new Product(null, title, imageUrl, description, price);
  // product.save();
  // resp.redirect('/');
  // Product.create({
  //   title,
  //   imageUrl,
  //   description,
  //   price,
  // })
  // req.user
  //   .createProduct({
  //     title,
  //     imageUrl,
  //     description,
  //     price,
  //   })
  //   .then((res) => resp.redirect('/admin/products'))
  //   .catch((err) => console.log(err));
};

exports.getEditProduct = (req, resp) => {
  const prodId = req.params.productId;
  Product.findById(prodId).then((product) => {
    if (!product) resp.redirect('/');

    resp.render('admin/edit_product', {
      docTitle: 'Edit Product',
      path: '/edit_product',
      editing: true,
      product: product,
      isAuthenticated: req.session.loggedIn,
    });
    // const prodId = req.params.productId;
    // Product.findByPk(prodId).then((product) => {
    //   if (!product) resp.redirect('/');

    //   resp.render('admin/edit_product', {
    //     docTitle: 'Edit Product',
    //     path: '/edit_product',
    //     editing: true,
    //     product: product,
    //   });
  });
  // Product.findById(prodId).then((product) => {
  //   if (!product) resp.redirect('/');

  //   resp.render('admin/edit_product', {
  //     docTitle: 'Edit Product',
  //     path: '/edit_product',
  //     editing: true,
  //     product: product,
  //   });
  // });
};

exports.postEditProduct = (req, resp) => {
  Product.findById(req.body.id)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return resp.redirect('/');
      }
      product.title = req.body.title;
      product.price = req.body.price;
      product.description = req.body.description;
      product.imageUrl = req.body.imageUrl;
      return product.save().then(() => resp.redirect('/admin/products'));
    })
    .catch((error) => console.log(error));
  // const product = new Product(req.body);
  // product
  //   .save()
  //   .then(() => resp.redirect('/admin/products'))
  //   .catch((error) => console.log(error));
  // const { id, title, imageUrl, description, price } = req.body;
  // Product.findByPk(id)
  //   .then((product) => {
  //     return product.update({
  //       title,
  //       imageUrl,
  //       description,
  //       price,
  //     });
  //   })
  //   .then(() => resp.redirect('/admin/products'))
  //   .catch((err) => console.log(err));
  // const updatedProduct = new Product(id, title, imageUrl, description, price);
  // updatedProduct.save();
  // resp.redirect('/admin/products');
};

exports.postDeleteProduct = (req, resp) => {
  const id = req.body.id;
  Product.deleteOne({ _id: id, userId: req.user._id }).then(() => {
    resp.redirect('/admin/products');
  });
  // Product.deleteById(id).then(() => {
  //   resp.redirect('/admin/products');
  // });
  // Product.deleteById(id);
  // resp.redirect('/admin/products');
  // Product.destroy({ where: { id } })
  //   .then(() => resp.redirect('/admin/products'))
  //   .catch((err) => console.log(err));
};
