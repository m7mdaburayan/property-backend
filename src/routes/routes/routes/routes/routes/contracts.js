const express = require('express');
const router = express.Router();
const controller = require('../controllers/contractsController');

router.post('/', controller.createContract);
router.get('/unit/:unitId', controller.getContractsByUnit);

module.exports = router;
