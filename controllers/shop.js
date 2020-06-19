const Product = require('../models/product');
const Order = require('../models/order');
// const Cart = require('../models/cart');
// const Order = require('../models/order');

exports.getProducts = (req, resp, next) => {
  Product.find().then((products) => {
    resp.render('shop/product_list', {
      prods: products,
      docTitle: 'All Products',
      path: '/prods',
      isAuthenticated: req.session.loggedIn,
    });
  });
  // Product.fetchAll().then((products) => {
  //   resp.render('shop/product_list', {
  //     prods: products,
  //     docTitle: 'All Products',
  //     path: '/prods',
  //   });
  // });
  // Product.findAll()
  //   .then((products) => {
  //     resp.render('shop/product_list', {
  //       prods: products,
  //       docTitle: 'All Products',
  //       path: '/prods',
  //     });
  //   })
  //   .catch((err) => console.log(err));
  // Product.fetchAll().then((p) => {
  //   const products = p;
  //   resp.render('shop/product_list', {
  //     prods: products,
  //     docTitle: 'All Products',
  //     path: '/prods',
  //   });
  // });
};

exports.getProduct = (req, resp) => {
  Product.findById(req.params.productId).then((product) => {
    resp.render('shop/product_detail', {
      product,
      docTitle: 'Product - ' + product.title,
      path: '/prods',
      isAuthenticated: req.session.loggedIn,
    });
  });
  // Product.findById(req.params.productId)
  // Product.findByPk(req.params.productId).then((product) =>
  //   resp.render('shop/product_detail', {
  //     product,
  //     docTitle: 'Product - ' + product.title,
  //     path: '/prods',
  //   })
  // );
};

exports.getIndex = (req, resp, next) => {
  Product.find().then((products) => {
    resp.render('shop/index', {
      prods: products,
      docTitle: 'Shop',
      path: '/shop',
      isAuthenticated: req.session.loggedIn,
    });
  });
  // Product.fetchAll().then((products) => {
  //   resp.render('shop/index', {
  //     prods: products,
  //     docTitle: 'Shop',
  //     path: '/shop',
  //   });
  // });
  // Product.findAll()
  //   .then((products) => {
  //     resp.render('shop/index', {
  //       prods: products,
  //       docTitle: 'Shop',
  //       path: '/shop',
  //     });
  //   })
  //   .catch((err) => console.log(err));

  //   resp.render('shop/index', {
  //     prods: products,
  //     docTitle: 'Shop',
  //     path: '/shop',
  //   });
  // Product.fetchAll().then((p) => {
  //   const products = p;
  // });
};

exports.getCart = (req, resp) => {
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
    });
  // req.user.getCart().then((products) => {
  //   resp.render('shop/cart', {
  //     docTitle: 'Your Cart',
  //     path: '/cart',
  //     productsInCart: products,
  //   });
  // });
  // req.user
  //   .getCart()
  //   .then((cart) => {
  //     return cart.getProducts();
  //   })
  //   .then((products) => {
  //     resp.render('shop/cart', {
  //       docTitle: 'Your Cart',
  //       path: '/cart',
  //       productsInCart: products,
  //     });
  //   })
  //   .catch((err) => console.log(err));
  // Cart.getCart().then((cart) => {
  //   Product.fetchAll().then((prods) => {
  //     const prodsData = [];
  //     const c = cart || {};
  //     for (const p of c.products) {
  //       const prodInCart = prods.find((t) => t.id === p.id);
  //       if (prodInCart) {
  //         prodsData.push({ product: prodInCart, qty: p.qty });
  //       }
  //     }
  //     resp.render('shop/cart', {
  //       docTitle: 'Your Cart',
  //       path: '/cart',
  //       productsInCart: prodsData,
  //     });
  //   });
  // });
};

exports.postCart = (req, resp) => {
  const id = req.body.prodId;
  Product.findById(id)
    .then((product) => {
      req.user.addProduct(product);
      resp.redirect('/cart');
    })
    .catch((error) => console.log(error));
  // let fetchedCart;
  // let newQty = 1;
  // req.user
  //   .getCart()
  //   .then((cart) => {
  //     fetchedCart = cart;
  //     cart
  //       .getProducts({ where: { id } })
  //       .then((products) => {
  //         let product;
  //         if (products.length) {
  //           product = products[0];
  //         }
  //         if (product) {
  //           const oldQty = product.CartItem.quantity;
  //           newQty = +oldQty + 1;
  //           return product;
  //         }
  //         return Product.findByPk(id);
  //       })
  //       .then((prod) => {
  //         return fetchedCart.addProduct(prod, {
  //           through: { quantity: newQty },
  //         });
  //       })
  //       .then(() => resp.redirect('/cart'))
  //       .catch((err) => console.log(err));
  //   })
  //   .catch((err) => console.log(err));
  // Product.findById(id).then((prod) => {
  //   Cart.addProduct(id, prod.price);
  // });
  // resp.redirect('/cart');
};

exports.postProductCartDelete = (req, resp) => {
  // const id = req.body.id;
  // Product.findById(id).then((product) => {
  //   Cart.deleteProduct(id, product.price);
  //   resp.redirect('/cart');
  // });
  const id = req.body.id;
  req.user.deleteProductFromCart(id).then(() => {
    resp.redirect('/cart');
  });
};

exports.getOrders = (req, resp) => {
  Order.find({ 'user.userId': req.user._id }).then((orders) => {
    resp.render('shop/orders', {
      docTitle: 'Your Orders',
      path: '/orders',
      orders,
      isAuthenticated: req.session.loggedIn,
    });
  });
  // req.user.getOrders().then((orders) => {
  //   resp.render('shop/orders', {
  //     docTitle: 'Your Orders',
  //     path: '/orders',
  //     orders,
  //   });
  // });
  // req.user
  //   .getOrders({ include: ['products'] })
  //   .then((orders) => {
  //     resp.render('shop/orders', {
  //       docTitle: 'Your Orders',
  //       path: '/orders',
  //       orders,
  //     });
  //   })
  //   .catch((err) => console.log(err));
};

exports.postOrder = (req, resp) => {
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
          userId: user,
        },
      };
      const ord = new Order(order);
      return ord.save();
    })
    .then(() => req.user.clearCart())
    .then(() => resp.redirect('/orders'));

  // req.user.addOrder().then(() => {
  //
  // });

  // let fetchedCart;
  // req.user
  //   .getCart()
  //   .then((cart) => {
  //     fetchedCart = cart;
  //     return cart.getProducts();
  //   })
  //   .then((products) => {
  //     return req.user
  //       .createOrder()
  //       .then((order) => {
  //         return order.addProduct(
  //           products.map((prod) => {
  //             prod.OrderItem = {
  //               quantity: prod.CartItem.quantity,
  //             };
  //             return prod;
  //           })
  //         );
  //       })
  //       .catch((err) => console.log(err));
  //   })
  //   .then(() => {
  //     return fetchedCart.setProducts(null);
  //   })
  //   .then(() => resp.redirect('/orders'))
  //   .catch((err) => console.log(err));
};
