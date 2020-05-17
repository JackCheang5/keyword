const sqlite3 = require('sqlite3').verbose();
const express = require('express');
const multer  = require('multer');
const upload = multer();
const fs = require('fs');

import { randomName } from './dist/js/misc.js';

const app = express();
const port = 5566;

const audio_path = './audio/'

let db = new sqlite3.Database('./db/test.db', (err) => {
  if (err) console.error(err.message);
  else console.log('Connected to the database');
})

app.post('/audio', upload.single('audio'), (req, res) => {
  const save_path = `${audio_path}${randomName()}.ogg`;
  console.log('Data received')
  fs.writeFile(save_path, req.file.buffer, (err) => {
    if (err) console.log(err);
    else console.log('Write compete');
  })
})

app.get('/keyword', (req, res) => {
  db.all('SELECT * FROM audio ORDER BY id', [], (err, rows) => {
    if (err) return console.log(err);
    //console.log(rows);
    res.send(rows);
  })
})

app.get('/changeKey', (req, res) => {
  //console.log(req.query);
  let data = [req.query.key, req.query.id];
  let sql = `UPDATE audio
              SET keyword = ?
              WHERE id = ?`;
  db.run(sql, data, (err) => {
    if (err) return console.error(err.message);
  });
  res.send('Keyword Changed');
})

app.use(express.static(`${__dirname}/dist`));

app.listen(port, ()=> {console.log(`listening on port: ${port}`);})

