
const db = require("../databaseConnection/db");



const getxbmdata = async (req, res) => {
  try {
    const [result] = await db.execute(`
       SELECT xbm.*, im.ntid
FROM xbm_data AS xbm
LEFT JOIN (
    SELECT old_imei, ntid
    FROM images
    WHERE (old_imei, id) IN (
        SELECT old_imei, MIN(id)
        FROM images
        GROUP BY old_imei
    )
) AS im ON xbm.old_imei = im.old_imei;
    `);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in getdata:", error);
    res.status(500).json({ 
      error: "Failed to fetch data",
      details: error.message 
    });
  }
};

module.exports = { getxbmdata };