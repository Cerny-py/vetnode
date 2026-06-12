const mysql = require('mysql2');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'vetnode'
});

db.connect((err) => {
  if (err) {
    console.error('Error al conectar con mysql:', err.message);
    return;
  }
  console.log('Conectado a mysql correctamente');
});

module.exports = db;