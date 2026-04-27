const mysql = require('mysql2');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  ...(process.env.DB_SSL === 'true' && { ssl: { rejectUnauthorized: true } })
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database!');
});

module.exports = connection.promise();
