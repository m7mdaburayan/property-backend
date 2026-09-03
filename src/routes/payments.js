const express = require('express');
const router = express.Router();
const controller = require('../controllers/paymentsController');

router.post('/', controller.createPayment);
router.put('/:id/pay', controller.markAsPaid);
router.get('/contract/:contractId', controller.getPaymentsByContract);

module.exports = router;
