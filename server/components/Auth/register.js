const db = require('../../databaseConnection/db.js'); // Assuming db is using mysql2 with promise support
const bcrypt = require('bcryptjs');

// The Register function
const register = async (req, res) => {
  let { email, password,role,store } = req.body;
  console.log('Incoming request body:', req.body);

  if (!email || !password) {
    // console.error('Missing email or password');
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  try {
    // Check if the user already exists
    const userCheckQuery = 'SELECT * FROM users WHERE email = ?';
    const [userCheckResult] = await db.execute(userCheckQuery, [email]);

    // console.log('User check query result:', userCheckResult);

    if (userCheckResult.length > 0) {
      // console.log('User already exists:', userCheckResult);
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // console.log('Hashed password:', hashedPassword);
     if (role === 'admin' || role === 'manager') {
      store = null;
    }

    // Insert new user into the database
    const insertQuery = 'INSERT INTO users (email, password,role,storeid) VALUES (?, ?,?,?)';
    const [insertResult] = await db.execute(insertQuery, [email, hashedPassword,role,store]);

    // console.log('User inserted successfully:', insertResult);

    res.status(201).json({
      message: 'Registration successful! Please login with your credentials.',
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { register };
