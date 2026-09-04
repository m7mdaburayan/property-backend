const express = require('express');
const router = express.Router();
const controller = require('../controllers/officeSettingsController');

router.get('/:companyId', controller.getSettings);
router.put('/:companyId', controller.upsertSettings);

module.exports = router;
