const db = require('../databaseConnection/db');

// List of allowed table names to prevent SQL injection
const ALLOWED_TABLES = ['rma_data', 'trade_in', 'xbm_data'];

const getMarketImageCounts = async (req, res) => {
    const { TableName } = req.params;
    console.log(TableName, "table name needed");

    if (!TableName) {
        return res.status(400).json({ message: "Table name is required" });
    }

    if (!ALLOWED_TABLES.includes(TableName)) {
        return res.status(400).json({ message: "Invalid table name" });
    }

    try {
        // Test query with direct table name to rule out ?? placeholder issue
        const query = `
            SELECT r.market AS Market,
                   COUNT(CASE WHEN i.image_url IS NULL THEN 1 END) AS notUploaded, 
                   COUNT(CASE WHEN i.image_url IS NOT NULL THEN 1 END) AS uploaded 
            FROM ${TableName} r
            LEFT JOIN images i ON r.old_imei = i.old_imei
            GROUP BY r.market;
        `;
        
        console.log('Executing query:', query);
        const [results] = await db.execute(query); // Removed placeholder for debugging
        console.log('Query results:', results);
        if (results.length === 0) {
            return res.status(404).json({ message: "No data found for this table" });
        }
        res.status(200).json(results);
    } catch (error) {
        console.error('Error fetching market image counts:', error.message, error.stack);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

const getStoresImageByMarket = async (req, res) => {
    const { market, TableName } = req.query;

    if (!market || !TableName) {
        return res.status(400).json({ message: 'Both market and table name are required' });
    }

    if (!ALLOWED_TABLES.includes(TableName)) {
        return res.status(400).json({ message: "Invalid table name" });
    }

    try {
        const query = `
            SELECT r.store_name AS store_name, 
                   r.created_at AS createdAt, 
                   COUNT(CASE WHEN i.image_url IS NULL THEN 1 END) AS notUploaded, 
                   COUNT(CASE WHEN i.image_url IS NOT NULL THEN 1 END) AS uploaded 
            FROM ${TableName} r
            LEFT JOIN images i ON r.old_imei = i.old_imei
            WHERE r.market = ?
            GROUP BY r.store_name, r.created_at
            ORDER BY r.created_at DESC;
        `;
        
        console.log('Executing query with TableName and market:', TableName, market);
        const [results] = await db.execute(query, [market]);
        console.log('Query results:', results);
        if (results.length === 0) {
            return res.status(404).json({ message: "No stores found for this market" });
        }
        res.status(200).json(results);
    } catch (error) {
        console.error('Error fetching store image stats:', error.message, error.stack);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

module.exports = { getMarketImageCounts, getStoresImageByMarket };