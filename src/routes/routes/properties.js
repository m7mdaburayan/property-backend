const express = require('express');
const router = express.Router();
const controller = require('../controllers/propertiesController');

router.post('/', controller.createProperty);        // إنشاء عقار جديد
router.get('/', controller.getAllProperties);        // جلب كل العقارات (للخريطة)
router.get('/:id', controller.getPropertyById);       // تفاصيل عقار واحد
router.put('/:id', controller.updateProperty);        // تعديل عقار
router.delete('/:id', controller.deleteProperty);     // حذف عقار

module.exports = router;
