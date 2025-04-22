const fs = require("fs");
const { parseCSV, parseXLSX } = require("./fileParsers");
const { insertRmaData, insertXBMData,insertTradeINData,insertTrackingData } = require("../../modals/rmaOperation");

const fileUpload = async (req, res) => {
  try {
    const { type } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    let parsedData;
    const { path, mimetype } = file;

    try {
      // Parse based on file type
      if (mimetype === "text/csv") {
        parsedData = await parseCSV(path);
      } else if (mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        parsedData = parseXLSX(path);
      } else {
        throw new Error("Unsupported file type");
      }

      // Process based on upload type
      switch (type) {
        case "RMA Data":
          await insertRmaData(parsedData);
          break;
        case "XBM Data":
          await insertXBMData(parsedData);
          break;
          case "Trade-In Data":
            await insertTradeINData(parsedData);
            break;
            case "Tracking Data":
              await insertTrackingData(parsedData);
              break;
        // Add more cases for other file types
        default:
          throw new Error("Unknown upload type");
      }

      fs.unlinkSync(path); // Clean up
      return res.status(200).json({ message: "File processed successfully" });
    } catch (error) {
      fs.unlinkSync(path); // Clean up even if error occurs
      throw error;
    }
  } catch (error) {
    console.error("File upload error:", error);
    return res.status(500).json({ 
      error: "An error occurred while processing the file",
      details: error.message 
    });
  }
};

module.exports = { fileUpload };