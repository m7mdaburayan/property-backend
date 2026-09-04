const pool = require('../db');

// حفظ رابط ملف تم رفعه مسبقاً إلى Cloudinary وربطه بعقار/وحدة/طلب صيانة
async function uploadDocument(req, res) {
  try {
    const { related_type, related_id, file_url, file_name } = req.body;

    if (!file_url) {
      return res.status(400).json({ error: 'لم يتم إرفاق رابط الملف' });
    }

    const result = await pool.query(
      `INSERT INTO documents (related_type, related_id, file_url, file_name)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [related_type, related_id, file_url, file_name || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'حدث خطأ أثناء حفظ الملف' });
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
