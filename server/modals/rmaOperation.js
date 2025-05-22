const db = require("../databaseConnection/db");

// Utility to format IST timestamp
const getISTTimestamp = () => {
  return new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
};

const checkDuplicate = async (tableName, field, value) => {
  const query = `SELECT COUNT(*) AS count FROM ${tableName} WHERE ${field} = ?`;
  console.log(`[${getISTTimestamp()}] INFO: Checking for duplicate in ${tableName} where ${field} = ${value}`);
  try {
    const [result] = await db.query(query, [value]);
    console.log(`[${getISTTimestamp()}] INFO: Duplicate check result for ${field} = ${value}: ${result[0].count > 0}`);
    return result[0].count > 0;
  } catch (error) {
    console.error(`[${getISTTimestamp()}] ERROR: Failed to check duplicate in ${tableName} for ${field} = ${value}: ${error.message}`);
    throw error;
  }
};

const insertRmaData = async (data) => {
  const query = `
    INSERT INTO rma_data 
    (market, store_id, store_name, description, old_imei, refund_label_type, 
     new_exchange_imei, employee_name, sold_date, tracking_details, 
     shipping_status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const results = {
    totalRecords: data.length,
    inserted: 0,
    skipped: 0,
    errors: []
  };

  console.log(`[${getISTTimestamp()}] INFO: Starting RMA data processing for ${data.length} records`);

  for (const row of data) {
    try {
      if (!row.old_imei) {
        const errorMsg = "Old_imei number is missing in the file";
        console.error(`[${getISTTimestamp()}] ERROR: ${errorMsg} for row: ${JSON.stringify(row)}`);
        results.errors.push(`Error processing row with old_imei unknown: ${errorMsg}`);
        continue;
      }

      if (await checkDuplicate('rma_data', 'old_imei', row.old_imei)) {
        console.warn(`[${getISTTimestamp()}] WARN: Duplicate data detected for old_imei: ${row.old_imei}. Skipping insertion.`);
        results.skipped++;
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
      console.log(`[${getISTTimestamp()}] INFO: Successfully inserted RMA data for old_imei: ${row.old_imei}`);
      results.inserted++;
    } catch (error) {
      console.error(`[${getISTTimestamp()}] ERROR: Failed to insert RMA data for old_imei ${row.old_imei || 'unknown'}: ${error.message}`);
      results.errors.push(`Error processing row with old_imei ${row.old_imei || 'unknown'}: ${error.message}`);
    }
  }

  console.log(`[${getISTTimestamp()}] INFO: Completed RMA data processing. Inserted: ${results.inserted}, Skipped: ${results.skipped}, Errors: ${results.errors.length}`);
  return results;
};

const insertXBMData = async (data) => {
  const query = `
    INSERT INTO xbm_data 
    (market, store_id, store_name, ordered_date, description, 
     old_imei, new_imei, label_type, tracking_number, status,
     created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const results = {
    totalRecords: data.length,
    inserted: 0,
    skipped: 0,
    errors: []
  };

  console.log(`[${getISTTimestamp()}] INFO: Starting XBM data processing for ${data.length} records`);

  for (const row of data) {
    try {
      if (!row.old_imei) {
        const errorMsg = "old_imei is missing in the file";
        console.error(`[${getISTTimestamp()}] ERROR: ${errorMsg} for row: ${JSON.stringify(row)}`);
        results.errors.push(`Error processing row with old_imei unknown: ${errorMsg}`);
        continue;
      }

      if (await checkDuplicate('xbm_data', 'old_imei', row.old_imei)) {
        console.warn(`[${getISTTimestamp()}] WARN: Duplicate order detected for old_imei: ${row.old_imei}. Skipping insertion.`);
        results.skipped++;
        continue;
      }

      let orderedDate = row.ordered_date;
      if (orderedDate && !/^\d{4}-\d{2}-\d{2}$/.test(orderedDate)) {
        orderedDate = new Date(orderedDate).toISOString().split('T')[0];
        console.log(`[${getISTTimestamp()}] INFO: Converted ordered_date to ${orderedDate} for old_imei: ${row.old_imei}`);
      }

      await db.query(query, [
        row.market || "Unknown",
        row.store_id,
        row.store_name,
        orderedDate || new Date().toISOString().split('T')[0],
        row.description || null,
        row.old_imei,
        row.new_imei || null,
        row.label_type || 'Standard',
        row.tracking_number || null,
        row.status || 'Pending',
        new Date(),
        new Date()
      ]);
      console.log(`[${getISTTimestamp()}] INFO: Successfully inserted XBM data for old_imei: ${row.old_imei}`);
      results.inserted++;
    } catch (error) {
      console.error(`[${getISTTimestamp()}] ERROR: Failed to insert XBM data for old_imei ${row.old_imei || 'unknown'}: ${error.message}`);
      results.errors.push(`Error processing row with old_imei ${row.old_imei || 'unknown'}: ${error.message}`);
    }
  }

  console.log(`[${getISTTimestamp()}] INFO: Completed XBM data processing. Inserted: ${results.inserted}, Skipped: ${results.skipped}, Errors: ${results.errors.length}`);
  return results;
};

const insertTradeInData = async (data) => {
  const query = `
    INSERT INTO trade_in 
    (market, store_name, emp_id, invoice_date, ti_applied,
     old_imei, model, label_type, tracking_number, status,
     created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const results = {
    totalRecords: data.length,
    inserted: 0,
    skipped: 0,
    errors: []
  };

  console.log(`[${getISTTimestamp()}] INFO: Starting trade-in data processing for ${data.length} records`);

  for (const row of data) {
    try {
      if (!row.old_imei) {
        const errorMsg = "old_imei number is missing in the file";
        console.error(`[${getISTTimestamp()}] ERROR: ${errorMsg} for row: ${JSON.stringify(row)}`);
        results.errors.push(`Error processing row with old_imei unknown: ${errorMsg}`);
        continue;
      }
      if (!row.ti_applied) {
        const errorMsg = "Trade-in value must be provided";
        console.error(`[${getISTTimestamp()}] ERROR: ${errorMsg} for row: ${JSON.stringify(row)}`);
        results.errors.push(`Error processing row with old_imei ${row.old_imei}: ${errorMsg}`);
        continue;
      }

      if (await checkDuplicate('trade_in', 'old_imei', row.old_imei)) {
        console.warn(`[${getISTTimestamp()}] WARN: Duplicate trade-in detected for old_imei: ${row.old_imei}. Skipping insertion.`);
        results.skipped++;
        continue;
      }

      let invoiceDate = row.invoice_date;
      if (invoiceDate && !/^\d{4}-\d{2}-\d{2}$/.test(invoiceDate)) {
        invoiceDate = new Date(invoiceDate).toISOString().split('T')[0];
        console.log(`[${getISTTimestamp()}] INFO: Converted invoice_date to ${invoiceDate} for old_imei: ${row.old_imei}`);
      }

      const tiApplied = parseFloat(row.ti_applied);

      await db.query(query, [
        row.market || "Unknown",
        row.store_name,
        row.emp_id,
        invoiceDate || new Date().toISOString().split('T')[0],
        tiApplied,
        row.old_imei,
        row.model || null,
        row.label_type || 'Standard',
        row.tracking_number || null,
        row.status || 'Pending',
        new Date(),
        new Date()
      ]);
      console.log(`[${getISTTimestamp()}] INFO: Successfully inserted trade-in data for old_imei: ${row.old_imei}`);
      results.inserted++;
    } catch (error) {
      console.error(`[${getISTTimestamp()}] ERROR: Failed to insert trade-in data for old_imei ${row.old_imei || 'unknown'}: ${error.message}`);
      results.errors.push(`Error processing row with old_imei ${row.old_imei || 'unknown'}: ${error.message}`);
    }
  }

  console.log(`[${getISTTimestamp()}] INFO: Completed trade-in data processing. Inserted: ${results.inserted}, Skipped: ${results.skipped}, Errors: ${results.errors.length}`);
  return results;
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

  const results = {
    totalRecords: data.length,
    inserted: 0,
    skipped: 0,
    errors: []
  };

  console.log(`[${getISTTimestamp()}] INFO: Starting tracking data processing for ${data.length} records`);

  for (const row of data) {
    try {
      if (!row.old_imei) {
        const errorMsg = "Old IMEI is missing in the file";
        console.error(`[${getISTTimestamp()}] ERROR: ${errorMsg} for row: ${JSON.stringify(row)}`);
        results.errors.push(`Error processing row with old_imei unknown: ${errorMsg}`);
        continue;
      }
      if (!row.ups_tracking_number) {
        const errorMsg = "UPS tracking number is missing";
        console.error(`[${getISTTimestamp()}] ERROR: ${errorMsg} for row: ${JSON.stringify(row)}`);
        results.errors.push(`Error processing row with old_imei ${row.old_imei}: ${errorMsg}`);
        continue;
      }

      const [checkResult] = await db.query(checkImeiExistsQuery, [row.old_imei]);
      if (checkResult[0].count === 0) {
        console.warn(`[${getISTTimestamp()}] WARN: IMEI not found in system: ${row.old_imei}. Skipping update.`);
        results.skipped++;
        continue;
      }

      await db.query(query, [
        row.ups_tracking_number,
        new Date(),
        row.old_imei
      ]);
      console.log(`[${getISTTimestamp()}] INFO: Successfully updated tracking data for old_imei: ${row.old_imei}`);
      results.inserted++;
    } catch (error) {
      console.error(`[${getISTTimestamp()}] ERROR: Failed to update tracking data for old_imei ${row.old_imei || 'unknown'}: ${error.message}`);
      results.errors.push(`Error processing row with old_imei ${row.old_imei || 'unknown'}: ${error.message}`);
    }
  }

  console.log(`[${getISTTimestamp()}] INFO: Completed tracking data processing. Inserted: ${results.inserted}, Skipped: ${results.skipped}, Errors: ${results.errors.length}`);
  return results;
};

module.exports = {
  insertRmaData,
  insertXBMData,
  insertTradeInData,
  insertTrackingData,
  checkDuplicate
};