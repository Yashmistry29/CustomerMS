const express = require('express');
const router = express.Router();
const services = require('../Services/services');

// Customer Routes
router.post('/customer/register', services.register);
router.post('/customer/login', services.login);
router.post('/customer/logout', services.logout);
router.get('/customer/:customerId', services.getCustomer);
router.put('/customer/:customerId', services.updateCustomer);
router.get('/customer/address/:customerId', services.getAddress);
router.post('/customer/address/:customerId', services.addAddress);
router.put('/customer/address/:customerId', services.updateAddress);
router.delete('/customer/address/:customerId', services.deleteAddress);
router.all('*', services.invalidRoute);

module.exports = router;
