const pool = require('../db');

async function createTenant(req, res) {
  try {
    const { full_name, email, phone, national_id } = req.body;
    const result = await pool.query(
      `INSERT INTO tenants (full_name, email, phone, national_id) VALUES ($1,$2,$3,$4) RETURNING *`,
      [full_name, email, phone, national_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'حدث خطأ أثناء إضافة المستأجر' });
  }
}

async function getAllTenants(req, res) {
  try {
    const result = await pool.query('SELECT * FROM tenants ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'حدث خطأ أثناء جلب المستأجرين' });
  }
}

module.exports = { createTenant, getAllTenants };
