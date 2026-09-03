const pool = require('../db');

async function createPayment(req, res) {
  try {
    const { contract_id, amount, due_date } = req.body;
    const result = await pool.query(
      `INSERT INTO payments (contract_id, amount, due_date) VALUES ($1,$2,$3) RETURNING *`,
      [contract_id, amount, due_date]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'حدث خطأ أثناء إنشاء الدفعة' });
  }
}

async function markAsPaid(req, res) {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `UPDATE payments SET status='paid', paid_date=NOW() WHERE id=$1 RETURNING *`,
      [id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'حدث خطأ أثناء تحديث الدفعة' });
  }
}

async function getPaymentsByContract(req, res) {
  try {
    const { contractId } = req.params;
    const result = await pool.query('SELECT * FROM payments WHERE contract_id = $1', [contractId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'حدث خطأ أثناء جلب المدفوعات' });
  }
}

module.exports = { createPayment, markAsPaid, getPaymentsByContract };
