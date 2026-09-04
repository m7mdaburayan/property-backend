const pool = require('../db');

// توليد رمز دعوة عشوائي مكوّن من 6 خانات
function generateInviteCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

// إضافة عميل (مالك) جديد لمكتب العقار
async function createClient(req, res) {
  try {
    const { management_company_id, full_name, phone, email, national_id } = req.body;
    const invite_code = generateInviteCode();

    const result = await pool.query(
      `INSERT INTO owner_clients (management_company_id, full_name, phone, email, national_id, invite_code)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [management_company_id, full_name, phone || null, email || null, national_id || null, invite_code]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'حدث خطأ أثناء إضافة العميل' });
  }
}

// جلب كل عملاء مكتب معيّن مع عدد العقارات المرتبطة بكل عميل
async function getClientsByCompany(req, res) {
  try {
    const { companyId } = req.params;
    const clients = await pool.query(
      `SELECT * FROM owner_clients WHERE management_company_id = $1 ORDER BY created_at DESC`,
      [companyId]
    );

    const withProps = await Promise.all(clients.rows.map(async (c) => {
      const props = await pool.query(
        `SELECT name FROM properties WHERE owner_client_id = $1`,
        [c.id]
      );
      return { ...c, properties: props.rows.map(p => p.name) };
    }));

    res.json(withProps);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'حدث خطأ أثناء جلب العملاء' });
  }
}

// ربط حساب مالك مسجّل بسجل عميل عبر رمز الدعوة
async function linkAccount(req, res) {
  try {
    const { invite_code, user_id } = req.body;
    const result = await pool.query(
      `UPDATE owner_clients SET linked_user_id = $1, invite_status = 'linked'
       WHERE invite_code = $2 AND invite_status = 'pending' RETURNING *`,
      [user_id, invite_code]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'رمز الدعوة غير صحيح أو مستخدم مسبقاً' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'حدث خطأ أثناء ربط الحساب' });
  }
}

module.exports = { createClient, getClientsByCompany, linkAccount };
