//Roi Katz 313299729 Aran Ben Ezra 316256403
var express = require('express');
var routerabout = express.Router();

//Receives '/about' as 'GET' requests and returns an object with the details of the two developers
routerabout.get("/about",async(req,res) => {
    const team = '[{"firstname":"roi","lastname":"katz","id":313299729,"email":"kroi444@gmail.com"},{"firstname":"aran","lastname":"ben ezra","id":316256403,"email":"arbeez@gmail.com"}]'
    res.send(JSON.parse(team))
});
module.exports = routerabout