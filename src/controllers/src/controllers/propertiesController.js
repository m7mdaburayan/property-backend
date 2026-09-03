const pool = require('../db');

async function createProperty(req, res) {
  try {
    const { owner_id, name, property_type, address, city, latitude, longitude } = req.body;

    const result = await pool.query(
      `INSERT INTO properties (owner_id, name, property_type, address, city, latitude, longitude)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [owner_id, name, property_type, address, city, latitude, longitude]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'حدث خطأ أثناء إنشاء العقار' });
  }
}

async function getAllProperties(req, res) {
  try {
    const { minLat, maxLat, minLng, maxLng } = req.query;

    let query = `SELECT id, owner_id, name, property_type, address, city, latitude, longitude, created_at
                 FROM properties`;
    const params = [];

    if (minLat && maxLat && minLng && maxLng) {
      query += ` WHERE latitude BETWEEN $1 AND $2 AND longitude BETWEEN $3 AND $4`;
      params.push(minLat, maxLat, minLng, maxLng);
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'حدث خطأ أثناء جلب العقارات' });
  }
}

async function getPropertyById(req, res) {
  try {
    const { id } = req.params;

    const property = await pool.query('SELECT * FROM properties WHERE id = $1', [id]);
    if (property.rows.length === 0) {
      return res.status(404).json({ error: 'العقار غير موجود' });
    }

    const units = await pool.query('SELECT * FROM units WHERE property_id = $1', [id]);
    const documents = await pool.query(
      `SELECT * FROM documents WHERE related_type = 'property' AND related_id = $1`,
      [id]
    );

    res.json({
      ...property.rows[0],
      units: units.rows,
      documents: documents.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'حدث خطأ أثناء جلب تفاصيل العقار' });
  }
}

async function updateProperty(req, res) {
  try {
    const { id } = req.params;
    const { name, property_type, address, city, latitude, longitude } = req.body;

    const result = await pool.query(
      `UPDATE properties
       SET name = $1, property_type = $2, address = $3, city = $4, latitude = $5, longitude = $6
       WHERE id = $7
       RETURNING *`,
      [name, property_type, address, city, latitude, longitude, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'العقار غير موجود' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'حدث خطأ أثناء تعديل العقار' });
  }
}

async function deleteProperty(req, res) {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM properties WHERE id = $1', [id]);
    res.json({ message: 'تم حذف العقار بنجاح' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'حدث خطأ أثناء حذف العقار' });
  }
}

module.exports = {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
};
