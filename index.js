var express = require("express"); //imports express as an object, make app
var app = express(); //call express as a function
var Hashids = require("hashids"); // use hashid 
	var hashids = new Hashids('this is my salt');
var db = require("./models");
var bodyParser = require("body-parser");
var ejsLayouts = require("express-ejs-layouts"); //get layout 
app.use(ejsLayouts); 
app.use(express.static(__dirname + '/views'));

app.use(bodyParser({urlencoded: false}));
app.set("view engine", "ejs");
//access homepage
app.get("/", function(req, res){ //sets root
	res.render("index");
});

//form entered, take data from url and create hash send to db and db sends back
app.post('/links', function(req, res){
	var newLink = req.body.url;
	db.url.create({ longURL: newLink }).then(function(data){
		
		var hash = hashids.encode(data.id);
		data.updateAttributes({hash: hash});
	res.redirect('/links/' + data.id);
	});
});

// get info out of db
app.get('/links/:id', function(req, res){
	db.url.findById(req.params.id).then(function(data){
		var url = data.longURL;
		var hash = data.hash;
		res.render("showLink", {url: url, hash: hash}); 
	}); 
});

//return hash
app.get('/:hash', function(req,res){
	var hash = req.params.hash;
	var id = hashids.decode(hash);
	id = id[0];
	db.url.findById(id).then(function(data){
		var url = data.longURL;
		res.redirect(url);
	});
});

//select statement - get everything from here where id matches
//go to redirect on link, what is this url supposed to be? take it and go there


app.listen(3000);

console.log("This is port 3000");