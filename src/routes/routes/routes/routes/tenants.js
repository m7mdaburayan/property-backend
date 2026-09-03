const express = require('express');
const router = express.Router();
const controller = require('../controllers/tenantsController');

router.post('/', controller.createTenant);
router.get('/', controller.getAllTenants);

module.exports = router;
