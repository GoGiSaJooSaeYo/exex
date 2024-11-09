const express = require('express');
const ejs = require('ejs');
const app = express();
var bodyParser = require('body-parser')
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(bodyParser.urlencoded({ extended: false }))

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

app.post('/contactProc', (req, res) => {
  const name = req.body.name
  const phone = req.body.phone
  const email = req.body.email
  const details = req.body.details

  let inform = `${name} ${phone}  ${email} ${details}`

  res.send(inform)
})



app.listen(port, () => console.log('서버 실행중'));
