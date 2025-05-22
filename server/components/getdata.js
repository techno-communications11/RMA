const db = require("../databaseConnection/db");

const getdata = async (req, res) => {
  try {
    const [result] = await db.execute(`
      SELECT rma.*, im.ntid, im.image_url
FROM rma_data AS rma
LEFT JOIN (
    SELECT old_imei, ntid, image_url
    FROM images
    WHERE (old_imei, id) IN (
        SELECT old_imei, MIN(id)
        FROM images
        GROUP BY old_imei
    )
) AS im ON rma.old_imei = im.old_imei;

    `);

    res.status(200).json(result);
  } catch (error) {
    console.error("Error in getdata:", error);
    res.status(500).json({
      error: "Failed to fetch data",
      details: error.message,
    });
  }
};

module.exports = { getdata };
