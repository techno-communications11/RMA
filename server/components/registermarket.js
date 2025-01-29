const db = require('../databaseConnection/db');

// Endpoint to register a new market
const registerMarket = async (req, res) => {
    const { market } = req.body;
    // console.log('Incoming request body:', req.body);

    if (!market) {
        // console.log('Missing market name');
        return res.status(400).send('Market name is required.');
    }

    const checkQuery = 'SELECT * FROM market WHERE market = ?';
    // console.log('Executing check query:', checkQuery);
    // console.log('Check query parameters:', [market]);

    try {
        const [rows] = await db.execute(checkQuery, [market]);
        if (rows.length > 0) {
            // console.log('Market already exists:', market);
            return res.status(409).send('Market already exists.');
        }

        const insertQuery = 'INSERT INTO market (market) VALUES (?)';
        // console.log('Executing insert query:', insertQuery);
        // console.log('Insert query parameters:', [market]);

        const [result] = await db.execute(insertQuery, [market]);
        // console.log('Market registered successfully:', result);
        res.status(201).send('Market registered successfully');
    } catch (err) {
        console.error('Error registering market:', err);
        res.status(500).send('Error registering market: ' + err.message);
    }
};

module.exports = { registerMarket };