const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 5566;

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/audio', (req, res) => {
  console.log(`${req.query.keyword}`);
})

app.use(express.static(`${__dirname}/dist`));

app.listen(port, ()=> {
  console.log(`listening on port: ${port}`);
})

