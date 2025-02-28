const express = require('express');
const router = express.Router();
const services = require('../Services/services');

// Customer Routes
router.post('/customer/register', services.register);
router.post('/customer/login', services.login);
router.post('/customer/logout', services.logout);
router.get('/customer/:customerId', services.getCustomer);
router.get('/customer/address/:customerId', services.getAddress);
router.post('/customer/address/:customerId', services.addAddress);
router.all('*', services.invalidRoute);

module.exports = router;
