const csvParser = require("csv-parser"); // For parsing CSV files
const xlsx = require("xlsx"); // For parsing XLSX files
const fs = require("fs");
const db = require("../databaseConnection/db"); // Import your SQL database connection

// Function to process the uploaded file
const fileUpload = async (req, res) => {
  // console.log("file reached");
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { path, mimetype } = file; // Get file path and MIME type
    let data = [];

    // Function to normalize headers by converting to lowercase and trimming spaces
    const normalizeHeaders = (headers) => {
      return headers.reduce((acc, header) => {
        const normalizedHeader = header.toLowerCase().replace(/\s+/g, "");
        acc[normalizedHeader] = header;
        return acc;
      }, {});
    };

    // Parse the file based on its type
    if (mimetype === "text/csv") {
      // Parse CSV file
      const csvData = [];
      fs.createReadStream(path)
        .pipe(csvParser())
        .on("data", (row) => {
          // Normalize headers and store row data
          const normalizedRow = {};
          const headers = Object.keys(row);
          // const normalizedHeaders = normalizeHeaders(headers);

          headers.forEach((header) => {
            const normalizedHeader = header.toLowerCase().replace(/\s+/g, "");
            normalizedRow[normalizedHeader] = row[header];
          });
          csvData.push(normalizedRow);
        })
        .on("end", async () => {
          data = csvData;
          try {
            await storeDataInDB(data); // Store parsed data in the database
            fs.unlinkSync(path); // Delete the file after processing
            return res
              .status(200)
              .json({ message: "File uploaded and data saved successfully" });
          } catch (error) {
            console.error("Database error:", error);
            return res.status(500).json({ error: "Error saving data to the database" });
          }
        });
    } else if (mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      // Parse XLSX file
      const workbook = xlsx.readFile(path);
      const sheetName = workbook.SheetNames[0]; // Assume the first sheet contains the data
      const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

      // Normalize headers and store the data
      const normalizedData = sheetData.map((row) => {
        const normalizedRow = {};
        const headers = Object.keys(row);

        headers.forEach((header) => {
          const normalizedHeader = header.toLowerCase().replace(/\s+/g, "");
          normalizedRow[normalizedHeader] = row[header];
        });
        return normalizedRow;
      });

      data = normalizedData;

      try {
        await storeDataInDB(data); // Store parsed data in the database
        fs.unlinkSync(path); // Delete the file after processing
        return res
          .status(200)
          .json({ message: "File uploaded and data saved successfully" });
      } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ error: "Error saving data to the database" });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred while processing the file" });
  }
};

// Function to store parsed data in the database
const storeDataInDB = async (data) => {
  const insertQuery = `
    INSERT INTO rmadata (market, storeid, storename, empid, invoice, serial, modelname, value)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const checkDuplicateQuery = `
    SELECT COUNT(*) AS count
    FROM rmadata
    WHERE invoice = ? AND serial = ?
  `;

  for (const row of data) {
    const marketValue = row.market || "Unknown"; // Default market value

    let value = row["value"];
    if (value) {
      value = value.replace(/[^0-9.-]+/g, ""); // Clean value
    }

    if (!value || isNaN(value)) {
      throw new Error("Invalid file format");
    }

    if (!row["serial"]) {
      throw new Error("Serial number is missing in the file");
    }

    // Check for duplicates
    const [checkResult] = await db.query(checkDuplicateQuery, [row["invoice"], row["serial"]]);
    if (checkResult[0].count > 0) {
      console.warn(`Duplicate data detected for row: ${JSON.stringify(row)}. Skipping insertion.`);
      continue; // Skip duplicate rows
    }

    // Insert data into the database
    await db.query(insertQuery, [
      marketValue,
      row["storeid"],
      row["storename"],
      row["empid"],
      row["invoice"],
      row["serial"],
      row["modelname"],
      value,
    ]);
  }
};

module.exports = { fileUpload };
