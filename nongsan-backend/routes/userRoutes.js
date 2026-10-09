const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Khai báo các đường dẫn API dành cho User
router.get('/products', userController.getProducts);
router.get('/categories', userController.getCategories);
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/order', userController.createOrder);

module.exports = router;
