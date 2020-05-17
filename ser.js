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
  //console.log('Data received');
  //console.log(req.body.keyword);
  fs.writeFile(save_path, req.file.buffer, (err) => {
    if (err) console.log(err);
  })
  db.all('SELECT MAX(id) FROM audio', (err, max) => {
    //console.log(max['0']['MAX(id)'] + 1);
    let next_id;
    if (max['0']['MAX(id)']==null || max['0']['MAX(id)']==undefined) {
      next_id = 0;
    } else next_id = max['0']['MAX(id)'] + 1;
    let data = [next_id, req.body.keyword, save_path];
    let sql = `INSERT INTO audio (id, keyword, path)
                VALUES (?, ?, ?)`;
    db.run(sql, data, (err) => {
      if (err) return console.error(err.message);
      //else console.log('new keyword added');
    })
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
  //res.send('Keyword Changed');
})

app.get('/deleteKey', (req, res) => {
  db.all(`SELECT Path FROM audio WHERE Id=?`, req.query.id, (err, path) => {
    //console.log(path['0'].path);
    fs.unlink(path['0'].path, (err) => {
      if (err) console.error(err);
    });
  });
  db.run(`DELETE FROM audio WHERE id=?`, req.query.id, (err) => {
    if (err) return console.error(err.message);
  });
  res.send('deleted');
})

app.use(express.static(`${__dirname}/dist`));

app.listen(port, ()=> {console.log(`listening on port: ${port}`);})

