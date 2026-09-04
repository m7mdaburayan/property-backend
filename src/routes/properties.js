const express = require('express');
const router = express.Router();
const controller = require('../controllers/propertiesController');

router.post('/', controller.createProperty);
router.get('/', controller.getAllProperties);
router.get('/:id', controller.getPropertyById);
router.put('/:id', controller.updateProperty);
router.delete('/:id', controller.deleteProperty);
router.put('/:id/assign-client', controller.assignClient);

module.exports = router;
