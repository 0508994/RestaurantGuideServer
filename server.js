var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var multer  = require('multer');
var mysql = require('mysql');
var cors = require('cors');

var rgapi = require('./routes/rgapi');

var app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
var port = 8000;


app.set('port', (process.env.PORT || port));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/api', rgapi);

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
