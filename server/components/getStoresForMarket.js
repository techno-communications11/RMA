const db = require('../databaseConnection/db');

const getStoresForMarket = async (req, res) => {
    try {
        const { market } = req.query;
        // console.log('Incoming request query:', req.query);

        if (!market) {
            console.log('Missing market name');
            return res.status(400).json({ message: 'Market name is required' });
        }

        const getStoresQuery = `
            SELECT 
                storename AS storeName, 
                COUNT(serial) AS totalRma 
            FROM rmadata 
            WHERE market = ? 
            GROUP BY storename;
        `;
        // console.log('Executing getStoresQuery:', getStoresQuery);
        // console.log('Query parameters:', [market]);

        const [stores] = await db.execute(getStoresQuery, [market]);
        // console.log('Stores data:', stores);

        res.status(200).json(stores);
    } catch (error) {
        console.error('Error fetching stores for market:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { getStoresForMarket };