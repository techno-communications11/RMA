const db = require('../databaseConnection/db');

const getStoresForMarket = async (req, res) => {
    try {
        const { market } = req.query;
        // console.log('Incoming request query:', req.query);

        if (!market) {
            return res.status(400).json({ message: 'Market name is required' });
        }

        const getStoresQuery = `
            SELECT 
                store_name AS storeName, 
                COUNT(old_imei) AS totalRma 
            FROM rma_data 
            WHERE market = ? 
            GROUP BY store_name;
        `;
      

        const [stores] = await db.execute(getStoresQuery, [market]);
        console.log('Fetched stores:', stores);
        

        res.status(200).json(stores);
    } catch (error) {
        console.error('Error fetching stores for market:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { getStoresForMarket };