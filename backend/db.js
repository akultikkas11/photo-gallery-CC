const mysql = require('mysql2');

const db = mysql.createConnection({
  // host: 'localhost',
  // user: 'root',
  // password: 'database',
  // database: 'photo_gallery'

  host: 'photo-gallery-db.cbkecoy4abv6.eu-north-1.rds.amazonaws.com',
  user: 'admin',
  password: 'database',
  database: 'photo_gallery'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

module.exports = db;
