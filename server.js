var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var multer  = require('multer');
var mysql = require('mysql');


//var index = require('./routes/index');
var rgapi = require('./routes/rgapi')



var app = express();
var port = 8000;
//view engine

//app.set('views',path.join(__dirname,'views'));
//app.set('view engine','ejs');
//app.engine('html', require('ejs').renderFile);

//set static folder


//body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//app.use(express.static(path.join(__dirname, 'public')));

//session
//app.use(session({secret:"password", resave:false, saveUninitialized:true}));


//app.use('/', index);
app.use('/api', rgapi);

app.listen(port, function(){
    console.log('Server started on port', + port);
})
