const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');
const { isAuth } = require('../middlewares/is-auth');
router.get('/add_product', isAuth, adminController.getAddProduct);

router.get('/products', isAuth, adminController.getProducts);

router.post('/add_product', isAuth, adminController.postAddProduct);

router.get('/edit_product/:productId', isAuth, adminController.getEditProduct);

router.post('/edit_product', isAuth, adminController.postEditProduct);

router.post('/delete_product', isAuth, adminController.postDeleteProduct);

module.exports = router;
