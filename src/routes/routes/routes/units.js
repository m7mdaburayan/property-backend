const express = require('express');
const router = express.Router();
const controller = require('../controllers/unitsController');

router.post('/', controller.createUnit);
router.get('/property/:propertyId', controller.getUnitsByProperty);
router.put('/:id', controller.updateUnit);
router.delete('/:id', controller.deleteUnit);

module.exports = router;
