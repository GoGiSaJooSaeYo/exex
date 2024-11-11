const express = require('express');
const ejs = require('ejs');
const app = express();
var bodyParser = require('body-parser');

require('dotenv').config();
const mysql = require('mysql2');
const url = require('url');

const dbUrl = process.env.DATABASE_URL;
const connectionParams = url.parse(dbUrl);

const [username, password] = connectionParams.auth.split(':');
const connection = mysql.createConnection({
  host: connectionParams.hostname,
  port: connectionParams.port || 3306,
  user: username,
  password: password,
  database: connectionParams.pathname.replace('/', ''),
});

connection.connect((err) => {
  if (err) console.error('MySQL 연결 실패:', err);
  console.log('MySQL에 성공적으로 연결되었습니다.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.render('index'); // ./views/index.ejs
});
app.get('/login', (req, res) => {
  res.render('login');
});
app.get('/profile', (req, res) => {
  res.render('profile');
});

app.get('/contact', (req, res) => {
  res.render('contact');
});

app.get('/contactList', (req, res) => {
  let sql = 'select * from contacts';
  connection.query(sql, (err, results, fields) => {
    if (err) throw err;
    res.render('contactList', { lists: results });
  });
});

app.post('/contactProc', (req, res) => {
  const name = req.body.name;
  const phone = req.body.phone;
  const email = req.body.email;
  const details = req.body.details;

  const sql = `INSERT INTO contacts (name, phone, email, details, regdate) VALUES (?, ?, ?, ?, now())`;
  connection.query(sql, [name, phone, email, details], (err, results) => {
    if (err) {
      console.error('데이터베이스 저장 오류:', err);
      res.status(500).send('데이터베이스 오류');
      return;
    }
    res.send("<script> alert('등록완료'); location.href='/' ; </script>");
  });
});
