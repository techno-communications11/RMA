const db = require('../../databaseConnection/db.js');

const getusers = async (req, res) => {
    try {
        const userId = req.user.id;
        const query = 'SELECT *FROM users WHERE id = ?';
        const [result] = await db.execute(query, [userId]);

        if (result.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.status(200).json(result[0]);
    } catch (error) {
        console.error('Error fetching user:', error);
        return res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
};

module.exports = { getusers };