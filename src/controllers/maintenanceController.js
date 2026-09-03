const pool = require('../db');

async function createRequest(req, res) {
  try {
    const { unit_id, reported_by, description, cost } = req.body;
    const result = await pool.query(
      `INSERT INTO maintenance_requests (unit_id, reported_by, description, cost)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [unit_id, reported_by || null, description, cost || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'حدث خطأ أثناء إنشاء طلب الصيانة' });
  }
}

async function getRequestsByOwner(req, res) {
  try {
    const { ownerId } = req.params;
    const result = await pool.query(
      `SELECT mr.*, u.unit_number, p.name AS property_name
       FROM maintenance_requests mr
       JOIN units u ON mr.unit_id = u.id
       JOIN properties p ON u.property_id = p.id
       WHERE p.owner_id = $1
       ORDER BY mr.created_at DESC`,
      [ownerId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'حدث خطأ أثناء جلب طلبات الصيانة' });
  }
}

async function updateStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const result = await pool.query(
      `UPDATE maintenance_requests SET status = $1 WHERE id = $2 RETURNING *`,
      [status, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'حدث خطأ أثناء تحديث حالة الطلب' });
  }
}

module.exports = { createRequest, getRequestsByOwner, updateStatus };
