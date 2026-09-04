const express = require('express');
const router = express.Router();
const controller = require('../controllers/documentsController');

router.post('/', controller.uploadDocument);
router.get('/:relatedType/:relatedId', controller.getDocuments);

module.exports = router;
