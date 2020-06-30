const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shop');
const { isAuth } = require('../middlewares/is-auth');
router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProduct);

router.get('/cart', isAuth, shopController.getCart);

router.post('/cart', isAuth, shopController.postCart);

router.post(
  '/delete_cart_product',
  isAuth,
  shopController.postProductCartDelete
);

router.get('/orders', isAuth, shopController.getOrders);

router.get('/orders/:orderId', isAuth, shopController.getInvoices);

router.post('/add_order', isAuth, shopController.postOrder);

module.exports = router;
