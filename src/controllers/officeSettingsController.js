const pool = require('../db');

// جلب إعدادات المكتب (يرجع إعدادات افتراضية لو ما سجّل المكتب أي إعدادات بعد)
async function getSettings(req, res) {
  try {
    const { companyId } = req.params;
    const result = await pool.query(
      `SELECT * FROM office_settings WHERE management_company_id = $1`,
      [companyId]
    );
    if (result.rows.length === 0) {
      return res.json({
        management_company_id: companyId,
        commission_type: 'percentage',
        commission_value: 10,
        vat_enabled: false,
        vat_percent: 15,
        stamp_url: null,
        cr_number: null
      });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'حدث خطأ أثناء جلب الإعدادات' });
  }
}

// إنشاء أو تحديث إعدادات المكتب (Upsert)
async function upsertSettings(req, res) {
  try {
    const { companyId } = req.params;
    const { commission_type, commission_value, vat_enabled, vat_percent, stamp_url, cr_number } = req.body;

    const result = await pool.query(
      `INSERT INTO office_settings (management_company_id, commission_type, commission_value, vat_enabled, vat_percent, stamp_url, cr_number)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       ON CONFLICT (management_company_id)
       DO UPDATE SET commission_type=$2, commission_value=$3, vat_enabled=$4, vat_percent=$5, stamp_url=$6, cr_number=$7, updated_at=NOW()
       RETURNING *`,
      [companyId, commission_type, commission_value, vat_enabled, vat_percent, stamp_url || null, cr_number || null]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'حدث خطأ أثناء حفظ الإعدادات' });
  }
}

module.exports = { getSettings, upsertSettings };
