const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./db/test.db', (err) => {
  if (err) console.error(err.message);
  else console.log('Connected to the database');
})

/*db.run('CREATE TABLE IF NOT EXISTS audio (id INT, keyword VARCHAR(30), path VARCHAR(50))', (err) => {
  if (err) return console.log(err);
});
db.run('INSERT INTO audio (id, keyword, path) VALUES (0, "hello", "./audio/000.ogg")', (err) => {
  if (err) return console.log(err);
});
db.run('INSERT INTO audio (id, keyword, path) VALUES (1, "bye", "./audio/001.ogg")', (err) => {
  if (err) return console.log(err);
});
db.all('SELECT * FROM audio ORDER BY id', [], (err, rows) => {
  if (err) return console.log(err);
  console.log(rows);
  rows.forEach((row) => {
    console.log(`ID: ${row.id}`);
    console.log(`Keyword: ${row.keyword}`);
    console.log(`Path: ${row.path}`);
  })
})*/


db.close((err) => {
  if (err) console.error(err.message);
  else console.log('DB connection closed');
});



