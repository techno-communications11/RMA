const db = require('../databaseConnection/db');

// Fetch counts for uploaded and not uploaded images by market, including createdat
const getMarketImageCounts = async (req, res) => {
    // console.log('Incoming request query:', req.query);
    try {
        const query = `
            SELECT r.market, 
                   r.createdat, 
                   COUNT(CASE WHEN i.ImageURL IS NULL THEN 1 END) AS notUploaded, 
                   COUNT(CASE WHEN i.ImageURL IS NOT NULL THEN 1 END) AS uploaded 
            FROM rmadata r
            LEFT JOIN ntid_image_url i ON r.serial = i.serial
            GROUP BY r.market, r.createdat
            ORDER BY r.createdat DESC;
        `;
        // console.log('Executing query:', query);
        const [results] = await db.execute(query);
        // console.log('Query results:', results);
        res.status(200).json(results);
    } catch (error) {
        console.error('Error fetching market image counts:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Fetch store details and their image statuses for a specific market, including createdat
const getStoresImageByMarket = async (req, res) => {
    const { market } = req.query;
    // console.log('Incoming request query:', req.query);

    if (!market) {
        // console.log('Missing market name');
        return res.status(400).json({ message: 'Market is required' });
    }

    try {
        const query = `
            SELECT r.storename AS storeName, 
                   r.createdat, 
                   COUNT(CASE WHEN i.ImageURL IS NULL THEN 1 END) AS notUploaded, 
                   COUNT(CASE WHEN i.ImageURL IS NOT NULL THEN 1 END) AS uploaded 
            FROM rmadata r
            LEFT JOIN ntid_image_url i ON r.serial = i.serial
            WHERE r.market = ? 
            GROUP BY r.storename, r.createdat
            ORDER BY r.createdat DESC;
        `;
        // console.log('Executing query:', query);
        // console.log('Query parameters:', [market]);
        const [results] = await db.execute(query, [market]);
        // console.log('Query results:', results);
        res.status(200).json(results);
    } catch (error) {
        console.error('Error fetching store image stats:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { getMarketImageCounts, getStoresImageByMarket };
