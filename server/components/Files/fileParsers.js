const csvParser = require("csv-parser");
const xlsx = require("xlsx");
const fs = require("fs");

const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const csvData = [];
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (row) => {
        const normalizedRow = {};
        Object.keys(row).forEach((header) => {
          normalizedRow[header.toLowerCase().replace(/\s+/g, "")] = row[header];
        });
        csvData.push(normalizedRow);
      })
      .on("end", () => resolve(csvData))
      .on("error", reject);
  });
};

const parseXLSX = (filePath) => {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

  return sheetData.map((row) => {
    const normalizedRow = {};
    Object.keys(row).forEach((header) => {
      normalizedRow[header.toLowerCase().replace(/\s+/g, "")] = row[header];
    });
    return normalizedRow;
  });
};

module.exports = {
  parseCSV,
  parseXLSX
};