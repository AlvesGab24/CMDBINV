const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database');

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  const sql = "SELECT * FROM assets";
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).send("Erro ao consultar ativos");
    }
    res.render('index', { assets: rows });
  });
});

app.post('/add', (req, res) => {
  const { name, purchase_date, model, owner } = req.body;
  const sql = "INSERT INTO assets (name, purchase_date, model, owner) VALUES (?, ?, ?, ?)";
  db.run(sql, [name, purchase_date, model, owner], err => {
    if (err) {
      return res.status(500).send("Erro ao inserir ativo");
    }
    res.redirect('/');
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

