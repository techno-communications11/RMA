    const db = require('../databaseConnection/db.js');

// Endpoint to register a new market
const registermarket = async (req, res) => {
    const { market } = req.body;

    if (!market) {
      
        return res.status(400).send('Market name is required.');
    }

    const checkQuery = 'SELECT * FROM market WHERE market = ?';


    try {
        const [rows] = await db.execute(checkQuery, [market]);
        if (rows.length > 0) {
            return res.status(409).send('Market already exists.');
        }

        const insertQuery = 'INSERT INTO market (market) VALUES (?)';
        

        const [result] = await db.execute(insertQuery, [market]);
        res.status(201).send('Market registered successfully');
    } catch (err) {
        console.error('Error registering market:', err);
        res.status(500).send('Error registering market: ' + err.message);
    }
};

module.exports = { registermarket };
