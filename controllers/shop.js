const Product = require('../models/product');
const Order = require('../models/order');
const path = require('path');
const { createWriteStream } = require('fs');
const PDFDocument = require('pdfkit');
const ITEM_PER_PAGE = 1;
exports.getProducts = (req, resp, next) => {
    const page = +req.query.page || 1;
    let numberItems;
    Product.find()
      .countDocuments()
      .then((nbrDocs) => {
        numberItems = nbrDocs;
        return Product.find()
          .skip((page - 1) * ITEM_PER_PAGE)
          .limit(ITEM_PER_PAGE);
      })
      .then((products) => {
        resp.render('shop/product_list', {
          prods: products,
          docTitle: 'All Products',
          path: '/prods',
          currentPage: page,
          hasNextPage: page * ITEM_PER_PAGE < numberItems,
          hasPrevPage: page > 1,
          nextPageNum: page + 1,
          prevPageNum: page - 1,
          lastPage: Math.ceil(numberItems / ITEM_PER_PAGE),
          firstPage: 1,
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
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getIndex = (req, resp, next) => {
  const page = +req.query.page || 1;
  let numberItems;
  Product.find()
    .countDocuments()
    .then((nbrDocs) => {
      numberItems = nbrDocs;
      return Product.find()
        .skip((page - 1) * ITEM_PER_PAGE)
        .limit(ITEM_PER_PAGE);
    })
    .then((products) => {
      resp.render('shop/index', {
        prods: products,
        docTitle: 'Shop',
        path: '/shop',
        csrfToken: req.csrfToken(),
        currentPage: page,
        hasNextPage: page * ITEM_PER_PAGE < numberItems,
        hasPrevPage: page > 1,
        nextPageNum: page + 1,
        prevPageNum: page - 1,
        lastPage: Math.ceil(numberItems / ITEM_PER_PAGE),
        firstPage: 1
      });
    })
    .catch((err) => {
      console.log(err);
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

exports.getInvoices = (req, resp, next) => {
  const orderId = req.params.orderId;
  const fileName = 'invoice-' + orderId + '.pdf';
  const invoicePath = path.join('uploads', 'invoices', fileName);
  Order.findById(orderId)
    .then((order) => {
      if (!order) {
        return next(new Error('No order found!'));
      }
      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error('Unauthorized!'));
      }
      const pdfDoc = new PDFDocument();
      resp.setHeader('Content-Type', 'application/pdf');
      resp.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
      pdfDoc.pipe(createWriteStream(invoicePath));
      pdfDoc.pipe(resp);

      pdfDoc.fontSize(24).text('Invoice', {
        align: 'center',
      });
      pdfDoc.text('--------------------');
      let total = 0;
      order.products.forEach((p) => {
        total += p.quantity * p.product.price;
        pdfDoc
          .fontSize(14)
          .text(`${p.product.title}-> (${p.quantity}) x $${p.product.price}`);
      });
      pdfDoc.text('--------------------');
      pdfDoc.text('Total: $' + total);

      pdfDoc.end();
      // readFile(invoicePath, (error, file) => {
      //   if (error) {
      //     return next(error);
      //   }
      //   resp.setHeader('Content-Type', 'application/pdf');
      //   resp.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
      //   resp.send(file);
      // });
      // const fileStream = createReadStream(invoicePath);
      // resp.setHeader('Content-Type', 'application/pdf');
      // resp.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
      // fileStream.pipe(resp);
    })
    .catch((err) => next(err));
};
