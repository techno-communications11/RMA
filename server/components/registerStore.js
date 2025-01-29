const db = require('../databaseConnection/db'); // Ensure correct import

const registerStore = async (req, res) => {
    const { store } = req.body;
    // console.log('Incoming request body:', req.body);

    if (!store) {
        // console.error('Missing store');
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    try {
        // Check if the store already exists
        const storeCheckQuery = 'SELECT * FROM stores WHERE store = ?';
        const [storeCheckResult] = await db.execute(storeCheckQuery, [store]);
        // console.log('Store check query result:', storeCheckResult);

        if (storeCheckResult.length > 0) {
            // console.log('Store already exists:', storeCheckResult);
            return res.status(400).json({ message: 'Store already exists' });
        }

        // Insert new store into the database
        const insertQuery = 'INSERT INTO stores (store) VALUES (?)';
        const [insertResult] = await db.execute(insertQuery, [store]);
        // console.log('Store inserted successfully:', insertResult);

        res.status(201).json({
            message: 'Store registration successful!',
            store: {
                id: insertResult.insertId,
                store: store,
            },
        });
    } catch (error) {
        console.error('Error during store registration:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { registerStore };
