const express = require('express');
const router = express.Router();
const controller = require('../controllers/ownerClientsController');

router.post('/', controller.createClient);
router.get('/company/:companyId', controller.getClientsByCompany);
router.post('/link', controller.linkAccount);

module.exports = router;
