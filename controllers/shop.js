const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = (req, resp, next) => {
  Product.find()
    .then((products) => {
      resp.render('shop/product_list', {
        prods: products,
        docTitle: 'All Products',
        path: '/prods',
        isAuthenticated: req.session.loggedIn,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getProduct = (req, resp, next) => {
  Product.findById(req.params.productId)
    .then((product) => {
      resp.render('shop/product_detail', {
        product,
        docTitle: 'Product - ' + product.title,
        path: '/prods',
        isAuthenticated: req.session.loggedIn,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getIndex = (req, resp, next) => {
  Product.find()
    .then((products) => {
      resp.render('shop/index', {
        prods: products,
        docTitle: 'Shop',
        path: '/shop',
        isAuthenticated: req.session.loggedIn,
        csrfToken: req.csrfToken(),
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getCart = (req, resp, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate() // mongoose to return a promise
    .then((user) => {
      const products = user.cart.items.map((i) => ({
        ...i.productId._doc,
        quantity: i.qty,
      }));
      resp.render('shop/cart', {
        docTitle: 'Your Cart',
        path: '/cart',
        productsInCart: products,
        isAuthenticated: req.session.loggedIn,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postCart = (req, resp, next) => {
  const id = req.body.prodId;
  Product.findById(id)
    .then((product) => {
      req.user.addProduct(product);
      resp.redirect('/cart');
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postProductCartDelete = (req, resp, next) => {
  const id = req.body.id;
  req.user
    .deleteProductFromCart(id)
    .then(() => {
      resp.redirect('/cart');
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getOrders = (req, resp, next) => {
  Order.find({ 'user.userId': req.user._id })
    .then((orders) => {
      resp.render('shop/orders', {
        docTitle: 'Your Orders',
        path: '/orders',
        orders,
        isAuthenticated: req.session.loggedIn,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postOrder = (req, resp, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate() // mongoose to return a promise
    .then((user) => {
      const products = user.cart.items.map((i) => ({
        product: i.productId._doc,
        quantity: i.qty,
      }));
      const order = {
        products,
        user: {
          name: user.name,
          email: user.email,
          userId: user,
        },
      };
      const ord = new Order(order);
      return ord.save();
    })
    .then(() => req.user.clearCart())
    .then(() => resp.redirect('/orders'))
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
