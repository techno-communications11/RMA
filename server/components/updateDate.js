const db = require("../databaseConnection/db");

const uploadData = async (req, res) => {
  const { old_imei, RMADate, RMANumber, ups_tracking_number } = req.body;

  // Check if the necessary fields are present
  if (!old_imei || !RMADate || !RMANumber || !ups_tracking_number) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Construct the SQL query to update the data
  const query = `
    Insert into tracking_details  
    ( ups_tracking_number,old_imei)
    values(?,?)
  `;

  // Values to be inserted into the query placeholders
  const values = [RMADate, RMANumber, ups_tracking_number, old_imei];

  try {
    // Execute the query
    const result = await db.query(query, values);

    // Check if the row was updated
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Record not found" });
    }

    // Send success response
    res.status(200).json({ message: "Data updated successfully" });
  } catch (err) {
    console.error("Error updating data:", err);
    res.status(500).json({ error: "Failed to update data" });
  }
};

module.exports = { uploadData };
