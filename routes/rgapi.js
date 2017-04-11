var express  = require('express');
var mysql = require('mysql');
var router  = express.Router();
var multer  = require('multer');
var upload = multer({dest:'./public/images/'});

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'milan',//milan
  password : 'milan',//milan
  database : 'mydb'
});

connection.connect();


router.post('/getCity', function(req, res){
        var name = 'Nis';/*req.body.cityName*/;
        console.log(name);
        connection.query('SELECT Name FROM City WHERE Name =?',[name], function (error, results, fields) {
          
        if (error) throw error;
            console.log('The city is: ', results[0]);   
            return res.end(JSON.stringify(results[0]));
        });
   
});

router.post('/imageUpload', upload.single('pic'), function (req, res) {
     //return res.end(req.file.filename);   // ako nece uradi strinfnfnif kao u CH
        var takerNick = req.body.takerNick;
        var placeId = req.body.placeId;
        var filename = req.file.filename;

        connection.query('INSERT INTO PICTURE (Name, TakerNickname, Place_PlaceId) VALUES(?, ?, ?) ',[fileName, takerNick, filename], function (error, results, fields) {
          
        if (error) throw error; 
            return res.end("Success!");
        });
});



module.exports = router;