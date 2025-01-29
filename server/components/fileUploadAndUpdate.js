const csvParser = require("csv-parser"); // For parsing CSV files
const xlsx = require("xlsx"); // For parsing XLSX files
const fs = require("fs");
const moment = require("moment"); // For date formatting
const db = require("../databaseConnection/db"); // Import your SQL database connection

// Function to handle file upload and data update
const fileUploadAndUpdate = async (req, res) => {
  // console.log("File reached");
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { path, mimetype } = file; // Get file path and MIME type
    let data = [];

    // Parse the file based on its type
    if (mimetype === "text/csv") {
      // Parse CSV file
      const csvData = [];
      fs.createReadStream(path)
        .pipe(csvParser())
        .on("data", (row) => csvData.push(row))
        .on("end", async () => {
          data = csvData;
          await updateDataInDB(data); // Process and update data in the database
          fs.unlinkSync(path); // Delete the file after processing
          return res.status(200).json({ message: "File processed successfully" });
        });
    } else if (mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      // Parse XLSX file
      const workbook = xlsx.readFile(path);
      const sheetName = workbook.SheetNames[0]; // Assume the first sheet contains the data
      const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
      data = sheetData;

      await updateDataInDB(data); // Process and update data in the database
      fs.unlinkSync(path); // Delete the file after processing
      return res.status(200).json({ message: "File processed successfully" });
    } else {
      return res.status(400).json({ error: "Unsupported file type. Only CSV or XLSX allowed." });
    }
  } catch (error) {
    console.error("Error processing file:", error);
    return res.status(500).json({ error: "An error occurred while processing the file" });
  }
};

// Function to update data in the database
const updateDataInDB = async (data) => {
  const checkQuery = `
    SELECT imageurl
    FROM ntid_image_url
    WHERE serial = ?
  `;
  const duplicateCheckQuery = `
    SELECT *
    FROM rma_upload_data
    WHERE serial = ? 
  `;
  const insertQuery = `
    INSERT INTO rma_upload_data (RMADate, RMANumber, UPSTrackingNumber, serial)
    VALUES (?, ?, ?, ?)
  `;

  try {
    await db.query("START TRANSACTION");

    for (const row of data) {
      const { serial, RMADate, RMANumber, UPSTrackingNumber } = row;

      // Ensure required fields are not missing
      if (!serial || !RMADate || !RMANumber || !UPSTrackingNumber) {
        console.warn(`Missing required fields for row: ${JSON.stringify(row)}. Skipping.`);
        continue;
      }

      // Normalize the date format
      const normalizedDate = moment(RMADate, ["MM/DD/YY", "M/D/YY"]).format("YYYY-MM-DD");
      if (!moment(normalizedDate, "YYYY-MM-DD", true).isValid()) {
        console.warn(`Invalid date format for serial "${serial}". Skipping.`);
        continue;
      }

      // Check if serial exists and has a non-null imageURL
      const [checkResult] = await db.query(checkQuery, [serial]);
      if (checkResult.length === 0) {
        console.warn(`Serial "${serial}" does not exist in the database. Skipping.`);
        continue;
      }

      const { imageurl } = checkResult[0];
      if (!imageurl) {
        console.warn(`Serial "${serial}" exists but does not have a valid imageurl. Skipping.`);
        continue;
      }

      // Check for duplicate entry in rma_upload_data
      const [duplicateCheck] = await db.query(duplicateCheckQuery, [serial]);
      if (duplicateCheck.length > 0) {
        console.log(`Entry for serial "${serial}" and RMANumber "${RMANumber}" already exists. Skipping.`);
        continue;
      }

      // Insert data into the database
      const [insertResult] = await db.query(insertQuery, [
        normalizedDate,
        RMANumber,
        UPSTrackingNumber,
        serial,
      ]);

      if (insertResult.affectedRows > 0) {
        console.log(`Data inserted for serial "${serial}".`);
      } else {
        console.warn(`Failed to insert data for serial "${serial}".`);
      }
    }

    await db.query("COMMIT");
  } catch (error) {
    await db.query("ROLLBACK");
    console.error("Error updating data in the database:", error);
    throw error;
  }
};



module.exports = { fileUploadAndUpdate };
