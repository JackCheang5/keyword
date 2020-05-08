const express = require('express');
const multer  = require('multer');
const upload = multer();
const fs = require('fs');

import { randomName } from './dist/js/misc.js';

const app = express();
const port = 5566;

const audio_path = './audio/'

app.post('/audio', upload.single('audio'), (req, res) => {
  const save_path = `${audio_path}${randomName()}.ogg`;
  console.log('Data received')
  fs.writeFile(save_path, req.file.buffer, (err) => {
    if (err) console.log(err);
    else console.log('Write compete');
  })
})

app.use(express.static(`${__dirname}/dist`));

app.listen(port, ()=> {console.log(`listening on port: ${port}`);})

