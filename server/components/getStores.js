const db = require('../databaseConnection/db');

const getStores = async (req, res) => {
    try {
        const [stores] = await db.execute('SELECT * FROM stores');
        res.status(200).json(stores);
    } catch (error) {
        console.error('Error fetching stores:', error);
        res.status(500).json({ message: 'Failed to get stores' });
    }
};

module.exports = { getStores };