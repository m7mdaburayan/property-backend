const express = require('express');
const multer = require('multer');
const router = express.Router();
const controller = require('../controllers/documentsController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

router.post('/', upload.single('file'), controller.uploadDocument);
router.get('/:relatedType/:relatedId', controller.getDocuments);

module.exports = router;
