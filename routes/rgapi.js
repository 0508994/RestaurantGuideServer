var express  = require('express');
var mysql = require('mysql');
var router  = express.Router();
var multer  = require('multer');
//var googleMapsClient = require('@google/maps').createClient({key:'AIzaSyAwhkF547Hfm-wh-EO2M_MQ0UFpomkYIpw'});
//var googleDistance = require('google-distance');

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
        console.log("called");
        connection.query('SELECT Name FROM City WHERE Name =?',[name], function (error, results, fields) {
            if (error) throw error;

            return res.send(results[0]);
        });
});


router.post('/getNearbyPlaces', function(req, res){
    var distance = 2;//zadata udaljenost od strane korisnika
    var lat = 43.3178475;//trenutna lokacija korisnika 
    var long = 21.8854669;


    connection.query('SELECT * FROM Place', function(error,results,fields){
        if (error) throw error;
        var array = new Array();
        var dist = 0;
   
        for (var i=0; i<results.length; i++)
        {
            //  googleDistance.get({index:1, origin:JSON.stringify(lat+','+long), destination: JSON.stringify(results[i].Latitude+','+results[i].Longitude)}, function(err, data){
            //         if (err) return error;
                    
            //         dist = data.distance;
            //         if(dist<distance)
            //         {
            //             array.push(results[i]);
            //         }
            // });
            dist =  getDistanceFromLatLonInKm(lat,long,results[i].Latitude, results[i].Longitude);
            if(dist<distance)
            {
                array.push(results[i]);
            }
        }
        
        return res.send(array);
    });
});

function calculateDistance(lat1, long1, lat2, long2, dist)
{
   googleDistance.get({index:1, origin:JSON.stringify(lat1+','+long1), destination: JSON.stringify(lat2+','+long2)}, function(err, data, dist){
         if (err) return error;

         dist = data.distance;
         return data.distance;
   });
}

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

//posle cemo u klijentskom delu isfiltrirati ove podatke


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


function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

module.exports = router;