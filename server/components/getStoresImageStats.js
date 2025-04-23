const db = require('../databaseConnection/db');

// Fetch counts for uploaded and not uploaded images by market, including createdat
const getMarketImageCounts = async (req, res) => {
    // console.log('Incoming request query:', req.query);
    try {
        const query = `
            SELECT r.market AS Market,
            r.store_name AS StoreName, 
                   r.created_at as createdAt, 
                   COUNT(CASE WHEN i.image_url IS NULL THEN 1 END) AS notUploaded, 
                   COUNT(CASE WHEN i.image_url IS NOT NULL THEN 1 END) AS uploaded 
            FROM rma_data r
            LEFT JOIN images i ON r.old_imei = i.old_imei
            GROUP BY r.market
            ORDER BY r.created_at DESC;
        `;
       
        const [results] = await db.execute(query);
        console.log('Executing query:', results);
        res.status(200).json(results);
    } catch (error) {
        console.error('Error fetching market image counts:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Fetch store details and their image statuses for a specific market, including createdat
const getStoresImageByMarket = async (req, res) => {
    const { market } = req.query;

    if (!market) {
    
        return res.status(400).json({ message: 'Market is required' });
    }

    try {
        const query = `
            SELECT r.store_name AS store_name, 
                   r.created_at as createdAt, 
                   COUNT(CASE WHEN i.image_url IS NULL THEN 1 END) AS notUploaded, 
                   COUNT(CASE WHEN i.image_url IS NOT NULL THEN 1 END) AS uploaded 
            FROM rma_data r
            LEFT JOIN images i ON r.old_imei = i.old_imei
            WHERE r.market = ? 
            GROUP BY r.store_name, r.created_at
            ORDER BY r.created_at DESC;
        `;
      
        const [results] = await db.execute(query, [market]);
    
        res.status(200).json(results);
    } catch (error) {
        console.error('Error fetching store image stats:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { getMarketImageCounts, getStoresImageByMarket };
