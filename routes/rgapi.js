var express  = require('express');
var mysql = require('mysql');
var router  = express.Router();

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'admin',//milan
  password : 'admin',//milan
  database : 'mydb'
});

connection.connect();


router.post('/getCity', function(req, res){
        var name = req.body.cityName;
        console.log(name);
        connection.query('SELECT Name FROM City WHERE Name =?',[name], function (error, results, fields) {
          
        if (error) throw error;
            console.log('The city is: ', results[0]);   
            return res.json(results[0]);
        });
   
});

module.exports = router;