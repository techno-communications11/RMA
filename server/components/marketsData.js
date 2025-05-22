const db = require("../databaseConnection/db");

const getMarketsData = async (req, res) => {
  const { TableName } = req.params;
   console.log("TableName:", TableName);
  try {
    // Query to get count of RMAs grouped by market and created date
    const getMarketsRmaStatsQuery = `
            SELECT market, created_at as createdAt, COUNT(*) AS totalRma
            FROM ${TableName}
            WHERE old_imei IS NOT NULL
            GROUP BY market
            ORDER BY created_at DESC;
        `;

    // Execute the query
    const [markets] = await db.execute(getMarketsRmaStatsQuery);
    // console.log('Markets RMA stats:', markets);

    // Transform the data to match your requirements
    const marketsData = markets.map((market) => ({
      marketName: market.market,
      createdAt: market.created_at,
      totalRma: market.totalRma,
    }));
    console.log("Transformed Markets Data:", marketsData);

    // Respond with the formatted data
    res.status(200).json(marketsData);
  } catch (error) {
    console.error("Error fetching markets data:", {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getMarketsData };
