var express  = require('express');
var mysql = require('mysql');
var router  = express.Router();

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'milan',//milan
  password : 'milan',//milan
  database : 'mydb'
});

router.post('/getCity', function(req, res){
    connection.connect();

        connection.query('SELECT * from city', function (error, results, fields) {
        if (error) throw error;
            console.log('The city is: ', results[0].Name);
        });

    connection.end();
});

module.exports = router;