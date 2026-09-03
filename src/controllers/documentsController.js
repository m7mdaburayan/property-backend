const pool = require('../db');

async function uploadDocument(req, res) {
  try {
    const { related_type, related_id } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'لم يتم إرفاق أي ملف' });
    }

    const file_url = `/uploads/${req.file.filename}`;
    const file_name = req.file.originalname;

    const result = await pool.query(
      `INSERT INTO documents (related_type, related_id, file_url, file_name)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [related_type, related_id, file_url, file_name]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'حدث خطأ أثناء رفع الملف' });
  }
}

async function getDocuments(req, res) {
  try {
    const { relatedType, relatedId } = req.params;
    const result = await pool.query(
      `SELECT * FROM documents WHERE related_type = $1 AND related_id = $2`,
      [relatedType, relatedId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'حدث خطأ أثناء جلب الملفات' });
  }
}

module.exports = { uploadDocument, getDocuments };
