const pool = require('../db');

async function createUnit(req, res) {
  try {
    const { property_id, unit_number, unit_type, area_sqm, monthly_rent } = req.body;
    const result = await pool.query(
      `INSERT INTO units (property_id, unit_number, unit_type, area_sqm, monthly_rent)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [property_id, unit_number, unit_type, area_sqm, monthly_rent]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'حدث خطأ أثناء إنشاء الوحدة' });
  }
}

async function getUnitsByProperty(req, res) {
  try {
    const { propertyId } = req.params;
    const result = await pool.query('SELECT * FROM units WHERE property_id = $1', [propertyId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'حدث خطأ أثناء جلب الوحدات' });
  }
}

async function updateUnit(req, res) {
  try {
    const { id } = req.params;
    const { unit_number, unit_type, area_sqm, status, monthly_rent } = req.body;
    const result = await pool.query(
      `UPDATE units SET unit_number=$1, unit_type=$2, area_sqm=$3, status=$4, monthly_rent=$5
       WHERE id=$6 RETURNING *`,
      [unit_number, unit_type, area_sqm, status, monthly_rent, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'حدث خطأ أثناء تعديل الوحدة' });
  }
}

async function deleteUnit(req, res) {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM units WHERE id = $1', [id]);
    res.json({ message: 'تم حذف الوحدة بنجاح' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'حدث خطأ أثناء حذف الوحدة' });
  }
}

module.exports = { createUnit, getUnitsByProperty, updateUnit, deleteUnit };
