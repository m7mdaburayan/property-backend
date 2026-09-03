const pool = require('../db');

async function createContract(req, res) {
  try {
    const { unit_id, tenant_id, start_date, end_date, monthly_rent, deposit_amount } = req.body;

    const result = await pool.query(
      `INSERT INTO contracts (unit_id, tenant_id, start_date, end_date, monthly_rent, deposit_amount)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [unit_id, tenant_id, start_date, end_date, monthly_rent, deposit_amount]
    );

    await pool.query(`UPDATE units SET status = 'occupied' WHERE id = $1`, [unit_id]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'حدث خطأ أثناء إنشاء العقد' });
  }
}

async function getContractsByUnit(req, res) {
  try {
    const { unitId } = req.params;
    const result = await pool.query('SELECT * FROM contracts WHERE unit_id = $1', [unitId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'حدث خطأ أثناء جلب العقود' });
  }
}

module.exports = { createContract, getContractsByUnit };
