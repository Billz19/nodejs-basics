const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin')
router.get('/add_product', adminController.getAddProduct);

router.get('/products', adminController.getProducts);

router.post('/add_product', adminController.postAddProduct);

router.get('/edit_product/:productId', adminController.getEditProduct);

router.post('/edit_product', adminController.postEditProduct);

router.post('/delete_product', adminController.postDeleteProduct);

module.exports = router
