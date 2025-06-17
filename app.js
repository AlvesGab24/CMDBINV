const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = process.env.PORT || 3000; // Usa a porta do ambiente ou 3000 localmente

// Configurações do Express
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Banco de dados SQLite
const db = new sqlite3.Database('./cmdb.db', (err) => {
  if (err) {
    console.error('Erro ao conectar no banco:', err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite.');
  }
});

// Criação da tabela itens, se não existir
db.run(`CREATE TABLE IF NOT EXISTS itens (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tipo TEXT NOT NULL,
  nome TEXT NOT NULL,
  data_compra TEXT,
  versao_modelo TEXT,
  usuario_proprietario TEXT
)`);

// Rotas

// Página principal - lista itens
app.get('/', (req, res) => {
  db.all('SELECT * FROM itens', [], (err, rows) => {
    if (err) {
      return res.status(500).send('Erro no banco de dados');
    }
    res.render('index', { itens: rows });
  });
});

// Formulário para adicionar item
app.get('/adicionar', (req, res) => {
  res.render('adicionar');
});

// Recebe dados do formulário e insere no banco
app.post('/adicionar', (req, res) => {
  const { tipo, nome, data_compra, versao_modelo, usuario_proprietario } = req.body;
  const sql = 'INSERT INTO itens (tipo, nome, data_compra, versao_modelo, usuario_proprietario) VALUES (?, ?, ?, ?, ?)';
  db.run(sql, [tipo, nome, data_compra, versao_modelo, usuario_proprietario], (err) => {
    if (err) {
      return res.status(500).send('Erro ao inserir no banco de dados');
    }
    res.redirect('/');
  });
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
