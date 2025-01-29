const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

// Create a MySQL connection pool with promise-based API
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 20, 
  queueLimit: 0,
});

db.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to the database: ', err);
  } else {
    console.log('Database connected!');
    connection.release();  // Make sure to release the connection
  }
});

module.exports = db.promise();
