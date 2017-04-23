var express  = require('express');
var mysql = require('mysql');
var router  = express.Router();
var multer  = require('multer');
var upload = multer({dest:'./public/images/'});

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'admin',//milan
  password : 'admin',//milan
  database : 'mydb'
});

connection.connect();


router.post('/getCityByName', function(req, res){
        var name = 'Nis';/*req.body.cityName*/;
      
        connection.query('SELECT Name FROM City WHERE Name =?',[name], function (error, results, fields) {
            if (error) throw error;

            return res.end(JSON.stringify(results[0]));
        });
});

router.post('/getPlaceByName', function(req, res){
    var name = req.body.placeName;//'Pleasure';/*req.body.placeName*/
    
    connection.query('SELECT * FROM Place WHERE Name =?',[name],function(error,results,fields){
            if(error) throw error;
            
            return res.end(JSON.stringify(results[0]));
    });
});


//netestirane funkcije
router.post('/getPlaceById', function(req, res){
    var placeId = 'Pleasure';/*req.body.placeName*/
    
    connection.query('SELECT * FROM Place WHERE PlaceId =?',[placeId],function(error,results,fields){
            if(error) throw error;
            
            return res.end(JSON.stringify(results[0]));
    });
});

router.post('getCommentById', function(req,res){
    var commentId = req.body.commentId;

    connection.query('SELECT * FROM Comment WHERE CommentId = ?', [commentId], function(error,results,fields){
            if(error) throw error;

            return res.end(JSON.stringify(results[0]));
    });
});

router.post('getRestaurantsByCoucine', function (req, res){
    var coucine = req.body.coucine;//italijanska, spanska, kineska, francuska, engleska, ruska, balkanska

    connection.query('SELECT * FROM Place WHERE Coucine = ?', [coucine], function(error, results,fields){
        if (error) throw error;

        return res.end(JSON.stringify(results));
    });
});


router.post('getPlacesByLiveMusic', function (req, res){
    var liveMusicBool = req.body.liveMusic; //prosledjujemo YES ili NO, kako ce i stajati u bazi

    connection.query('SELECT * FROM Place WHERE LiveMusic = ?', [liveMusicBool], function(error, results, fields){
        if (error) throw error;

        return res.end(JSON.stringify(results));
    });
});

router.post ('getPlacesByType', function (req, res){
    var placeType = req.body.placeType; //'restoran', 'kafana', 'kafic', klub

    connection.query('SELECT * FROM Place WHERE PlaceType = ?', [placeType], function(error, results, fields){
        if (error) throw error;

        return res.end(JSON.stringify(results));
    });
});

router.post('getCommentsByPlaceId', function(req, res){
    var placeId = req.body.placeId;

    connection.query('SELECT * FROM Comment WHERE PlaceId = ?',[placeId], function( error,results, fields){
        if(error) throw error;

        return res.end(JSON.stringify(results));
    });
});

router.post('getPlaceByCoucineAndMusic', function(req, res){
    var coucine = req.body.coucine;
    var music = req.body.liveMusic;

    connection.query('SELECT * FROM Place WHERE Coucine = ? AND LiveMusic = ?', [coucine,music], function(error, results, fields){
        if(error) throw error;

        return res.end(JSON.stringify(results));
    });
});

//---------------------------------------------------------------------------------------------------


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