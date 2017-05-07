var express  = require('express');
var mysql = require('mysql');
var router  = express.Router();
var multer  = require('multer');
//var googleMapsClient = require('@google/maps').createClient({key:'AIzaSyAwhkF547Hfm-wh-EO2M_MQ0UFpomkYIpw'});
//var googleDistance = require('google-distance');

var upload = multer({dest:'./public/images/'});

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'RestaurantGuide_Database'
  //database : 'mydb'
});

connection.connect();


router.post('/getCityByName', function(req, res){
        var name = 'Nis';
        //var name = req.body.cityName;
        console.log("called");
        connection.query('SELECT Name FROM City WHERE Name =?',[name], function (error, results, fields) {
            if (error) throw error;

            return res.send(results[0]);
        });
});


router.post('/getNearbyPlaces', function(req, res){
    var distance = req.body.distance;//zadata udaljenost od strane korisnika
    console.log(distance);
    var lat = req.body.location.latitude;//trenutna lokacija korisnika
    var long = req.body.location.longitude;

    console.log(lat);
    console.log(long);

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

                results[i].distance = Number((dist).toFixed(2));
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


router.post('/getPlacesByCriterias', function(req, res){
    var coucine = req.body.coucine;
    var music = req.body.liveMusic;
    var type = req.body.type;
    var opensAt = req.body.opensAt;
    var closesAt = req.body.closesAt;
    console.log(coucine);
    console.log(music);
    console.log(type);
    console.log(opensAt);
    console.log(closesAt);

    connection.query('SELECT * FROM Place WHERE Coucine = ? AND LiveMusic = ? AND PlaceType = ? AND OpensAt <= ? AND ClosesAt >= ?  ', [coucine, music, type, opensAt, closesAt], function(error, results, fields){
        if(error) throw error;

        return res.send(results);
    });
});

router.post('/getPlaceByName', function(req, res){
    var name = req.body.placeName;

    console.log(name);

    connection.query('SELECT * FROM Place WHERE Name = ?', [name], function(error, results, fields){
        if(error) throw error;

        return res.send(results[0]);
    });
});

router.post('/getPlaceMenu', function(req, res){
    var id = req.body.placeId;

    console.log(id);

    connection.query('SELECT * FROM MENUITEM WHERE PlaceId = ?', [id], function(error, results, fields){
        if(error) throw error;

        return res.send(results);
    });
});

router.post('/getPlaceReviews', function(req, res){
    var id = req.body.placeId;

    console.log(id);

    connection.query('SELECT * FROM COMMENT WHERE PlaceId = ?', [id], function(error, results, fields){
        if(error) throw error;

        return res.send(results);
    });
});

router.post('/getPhotosInformations', function(req, res){
    var id = req.body.placeId;

    console.log(id);

    connection.query('SELECT * FROM PICTURE WHERE Place_PlaceId = ? ORDER BY Timestamp DESC', [id], function(error, results, fields){
        if(error) throw error;

        return res.send(results);
    });
});

router.post('/createComment', function(req, res){
    var review = req.body.review;
    //var timestamp = (new Date()).toISOString().substring(0, 19).replace('T', ' ');

    connection.query('INSERT INTO COMMENT(Nickname, Text, Rating, Timestamp, PlaceId ) VALUES(?, ?, ?, now(), ?)', [review.nickname, review.comment, review.rating, review.placeId], function(error, results, fields){
        if(error) throw error;
        updateRating(review.placeId, review.rating);

        connection.query('SELECT * FROM COMMENT WHERE PlaceId = ? ORDER BY Timestamp DESC', [review.placeId], function(error, results, fields){
            if(error) throw error;

            return res.send(results);
        });
    });
});



router.post('/imageUpload', upload.single('pic'), function (req, res) {
        console.log("PlaceId is " + req.body.placeId);
        var placeId = req.body.placeId;
        var filename = 'images/'+ req.file.filename;
        //var timestamp = (new Date()).toISOString().substring(0, 19).replace('T', ' ');

        connection.query('INSERT INTO PICTURE (Name, Place_PlaceId, Timestamp) VALUES (?, ?, now()) ',[filename, placeId], function (error, results, fields)
        {
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

function updateRating(placeId, rating)
{
  connection.query('UPDATE PLACE SET GrossScore = GrossScore + ?, ReviewersNumber = ReviewersNumber + 1 WHERE PlaceId = ?', [rating, placeId], function(error, results, fields){
      if(error) throw error;
    });
}

module.exports = router;
