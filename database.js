const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./cmdb.sqlite', (err) => {
  if (err) {
    console.error('Erro ao abrir o banco de dados:', err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite.');
    db.run(`CREATE TABLE IF NOT EXISTS assets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      purchase_date TEXT,
      model TEXT,
      owner TEXT
    )`);
  }
});

module.exports = db;
