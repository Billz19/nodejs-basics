const Product = require('../models/product');
const { validationResult } = require('express-validator');

const {deleteFile} = require('../utils/file');
exports.getAddProduct = (req, resp, next) => {
  resp.render('admin/edit_product', {
    docTitle: 'Add Product',
    path: '/add_product',
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: [],
  });
};

exports.getProducts = (req, resp, next) => {
  Product.find({ userId: req.user._id })
    .then((products) => {
      resp.render('admin/products', {
        prods: products,
        docTitle: 'Admin Products',
        path: '/admin_prods',
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postAddProduct = (req, resp, next) => {
  const objParam = { ...req.body, userId: req.user };
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return resp.status(422).render('admin/edit_product', {
      docTitle: 'Add Product',
      path: '/add_product',
      editing: false,
      hasError: true,
      product: {
        title: objParam.title,
        price: objParam.price,
        description: objParam.description,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  const image = req.file;
  if (!image) {
    return resp.status(422).render('admin/edit_product', {
      docTitle: 'Add Product',
      path: '/add_product',
      editing: false,
      hasError: true,
      product: {
        title: objParam.title,
        price: objParam.price,
        description: objParam.description,
      },
      errorMessage: 'The attached file is not an image',
      validationErrors: [],
    });
  }

  objParam.imageUrl = image.path;

  const product = new Product(objParam);
  product
    .save()
    .then(() => resp.redirect('/admin/products'))
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getEditProduct = (req, resp, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      if (!product) resp.redirect('/');

      resp.render('admin/edit_product', {
        docTitle: 'Edit Product',
        path: '/edit_product',
        editing: true,
        product: product,
        errorMessage: null,
        hasError: false,
        validationErrors: [],
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postEditProduct = (req, resp, next) => {
  const { id, title, price, description } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return resp.render('admin/edit_product', {
      docTitle: 'Edit Product',
      path: '/add_product',
      editing: true,
      hasError: true,
      product: {
        title,
        price,
        description,
        id,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }
  const image = req.file;
  Product.findById(id)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return resp.redirect('/');
      }
      product.title = title;
      product.price = price;
      product.description = description;
      if (image) {
        deleteFile(product.imageUrl);
        product.imageUrl = image.path;
      }
      return product.save().then(() => resp.redirect('/admin/products'));
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postDeleteProduct = (req, resp, next) => {
  const id = req.body.id;
  Product.findById(id)
    .then((product) => {
      if (!product) return next(new Error('No product found'));
      deleteFile(product.imageUrl);
      return Product.deleteOne({ _id: id, userId: req.user._id });
    })
    .then(() => {
      resp.redirect('/admin/products');
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
