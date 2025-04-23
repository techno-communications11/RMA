const db = require("../databaseConnection/db");

const checkDuplicate = async (tableName, field, value) => {
  const query = `SELECT COUNT(*) AS count FROM ${tableName} WHERE ${field} = ?`;
  const [result] = await db.query(query, [value]);
  return result[0].count > 0;
};

const insertRmaData = async (data) => {
  const query = `
    INSERT INTO rma_data 
    (market, store_id, store_name, description, old_imei, refund_label_type, 
     new_exchange_imei, employee_name,  sold_date, tracking_details, 
     shipping_status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,  ?, ?, ?)
  `;

  for (const row of data) {
    if (!row.old_imei) {
      throw new Error("Old_imei number is missing in the file");
    }

    if (await checkDuplicate('rma_data', 'old_imei', row.old_imei)) {
      console.warn(`Duplicate data detected for row: ${JSON.stringify(row)}. Skipping insertion.`);
      continue;
    }

    await db.query(query, [
      row.market || "Unknown",
      row.store_id,
      row.store_name,
      row.description,
      row.old_imei,
      row.refund_label_type,
      row.new_exchange_imei,
      row.employee_name,
      row.sold_date,
      row.tracking_details,
      row.shipping_status,
      new Date(),
      new Date()
    ]);
  }
};



 const insertXBMData = async (data) => {

  const query = `
    INSERT INTO xbm_data 
    (market, store_id, store_name, ordered_date, description, 
     customer_imei, new_imei, label_type, tracking_number, status,
     created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  for (const row of data) {
    // Required field validation
    if (!row.customer_imei) {
      throw new Error("Customer IMEI is missing in the file");
    }

    // Check for duplicate order (based on customer_imei)
    if (await checkDuplicate('xbm_data', 'customer_imei', row.customer_imei)) {
      console.warn(`Duplicate order detected for IMEI: ${row.customer_imei}. Skipping insertion.`);
      continue;
    }

    // Convert date format if needed
    let orderedDate = row.ordered_date;
    if (orderedDate && !/^\d{4}-\d{2}-\d{2}$/.test(orderedDate)) {
      // Assuming the date might come in different formats - adjust as needed
      orderedDate = new Date(orderedDate).toISOString().split('T')[0];
    }

    await db.query(query, [
      row.market || "Unknown",
      row.store_id,
      row.store_name,
      orderedDate || new Date().toISOString().split('T')[0], // Default to today if not provided
      row.description || null,
      row.customer_imei,
      row.new_imei || null,
      row.label_type || 'Standard',
      row.tracking_number || null,
      row.status || 'Pending',
      new Date(),
      new Date()
    ]);
  }
};




  
const insertTradeInData = async (data) => {
  const query = `
    INSERT INTO trade_in 
    (market, store_name, emp_id, invoice_date, ti_applied,
     old_imei, model, label_type, tracking_number, status,
     created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  for (const row of data) {
    // Required field validation
    if (!row.old_imei) {
      throw new Error("old_imei number is missing in the file");
    }
    if (!row.ti_applied) {
      throw new Error("Trade-in value must be");
    }

    // Check for duplicate trade-in (based on old_imei)
    if (await checkDuplicate('trade_in', 'old_imei', row.old_imei)) {
      console.warn(`Duplicate trade-in detected for serial: ${row.old_imei}. Skipping insertion.`);
      continue;
    }

    // Convert date format if needed
    let invoiceDate = row.invoice_date;
    if (invoiceDate && !/^\d{4}-\d{2}-\d{2}$/.test(invoiceDate)) {
      invoiceDate = new Date(invoiceDate).toISOString().split('T')[0];
    }

    // Convert trade-in value to number
    const tiApplied = parseFloat(row.ti_applied);

    await db.query(query, [
      row.market || "Unknown",
      row.store_name,
      row.emp_id,
      invoiceDate || new Date().toISOString().split('T')[0], // Default to today if not provided
      tiApplied,
      row.old_imei,
      row.model || null,
      row.label_type || 'Standard',
      row.tracking_number || null,
      row.status || 'Pending',
      new Date(),
      new Date()
    ]);
  }
};

const insertTrackingData = async (data) => {
  const query = `
    UPDATE rma_data 
    SET ups_tracking_number = ?, 
        updated_at = ?
    WHERE old_imei = ?
  `;

  const checkImeiExistsQuery = `
    SELECT COUNT(*) AS count 
    FROM rma_data 
    WHERE old_imei = ?
  `;

  for (const row of data) {
    // Required field validation
    if (!row.old_imei) {
      throw new Error("Old IMEI is missing in the file");
    }
    if (!row.ups_tracking_number) {
      throw new Error("UPS tracking number is missing");
    }

    // Check if IMEI exists in the system
    const [checkResult] = await db.query(checkImeiExistsQuery, [row.old_imei]);
    if (checkResult[0].count === 0) {
      console.warn(`IMEI not found in system: ${row.old_imei}. Skipping update.`);
      continue;
    }

    // Update tracking information
    await db.query(query, [
      row.ups_tracking_number,
      new Date(),
      row.old_imei
    ]);
  }
};



module.exports = {
  insertRmaData,
  insertXBMData,
  insertTradeInData,
  insertTrackingData,
  checkDuplicate
};