const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 5566;

var multer  = require('multer')
var upload = multer()


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(upload.array());


app.post('/audio', (req, res) => {
  console.log(req.body);
  //console.log(`${req.body.keyword}, ${req.body.audio}`);
})

app.use(express.static(`${__dirname}/dist`));

app.listen(port, ()=> {
  console.log(`listening on port: ${port}`);
})

