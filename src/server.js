require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

// خدمة الصور والملفات المرفوعة كملفات ثابتة
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// ربط كل مجموعات المسارات
app.use('/api/auth', require('./routes/auth'));
app.use('/api/properties', require('./routes/properties'));
app.use('/api/units', require('./routes/units'));
app.use('/api/tenants', require('./routes/tenants'));
app.use('/api/contracts', require('./routes/contracts'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/documents', require('./routes/documents'));
app.use('/api/maintenance', require('./routes/maintenance'));

// نقطة فحص بسيطة للتأكد أن الخادم يعمل
app.get('/', (req, res) => {
  res.json({ message: 'منصة إدارة العقارات - الخادم يعمل بنجاح' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`الخادم يعمل الآن على المنفذ ${PORT}`);
});
