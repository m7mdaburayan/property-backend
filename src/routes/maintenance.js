const express = require('express');
const router = express.Router();
const controller = require('../controllers/maintenanceController');

router.post('/', controller.createRequest);
router.get('/owner/:ownerId', controller.getRequestsByOwner);
router.put('/:id/status', controller.updateStatus);

module.exports = router;
