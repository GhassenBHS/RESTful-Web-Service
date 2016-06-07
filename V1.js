  var Promise = require("bluebird");
var express = require('express')
  , http = require('http')
  , path = require('path')
  , bodyParser = require('body-parser')
  , logger = require('morgan')
  , methodOverride = require('method-override')
  , errorHandler = require('errorhandler')
  , mongoose = Promise.promisifyAll(require('mongoose'))
  , _v1 = require('./modules/contactdataservice_1')
   ,Promise = require("bluebird");

  CacheControl = require("express-cache-control");


var cache = new CacheControl().middleware;

//Passport implementation
var passport = require('passport'),
LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;




var app = express();
var url = require('url');
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(methodOverride());
//app.use(bodyParser.json());
app.use(express.cookieParser('secret here'));
app.use(bodyParser.urlencoded({
	  extended: true
	}));
app.use(express.session());
app.use(passport.initialize());
app.use(passport.session());



// development only
if ('development' == app.get('env')) {
	  app.use(errorHandler());
	}
	mongoose.connect('mongodb://127.0.0.1:27017/test');
		var contactSchema = new mongoose.Schema({
	  primarycontactnumber: {type: String, index: {unique: true}},
	  firstname: String,
	  lastname: String,
	  title: String,
	  company: String,
	  jobtitle: String,
	  othercontactnumbers: [String],
	  primaryemailaddress: String,
	  emailaddresses: [String],
	  groups: [String]
	});
	
	var Contact = mongoose.model('Contact', contactSchema);
	
	

	passport.serializeUser(function(user, done) {
		  done(null, user);
		});
		passport.deserializeUser(function(obj, done) {
		  done(null, obj);
		});
		
		passport.use(new LinkedInStrategy({
			clientID: '7718bf51es6nhv',
			clientSecret: 'bkJy8GO6ROMZzGjF',
		    callbackURL: "http://197.15.12.216:3000/auth/linkedin/callback",
		    scope: ['r_emailaddress', 'r_basicprofile'],
		    state: true
		  },function(token, tokenSecret, profile, done) {
		      process.nextTick(function () {
		          return done(null, profile);
		          console.log(token) ;
		        });
		      })
		    );
	
	
	app.get('/v1/contacts/:number',  passport.authenticate('linkedin', { session: true }),
function(request, response) {
		  console.log(request.url + ' : querying for ' + 
		request.params.number);
		  
		  _v1.findByNumber(Contact, request.params.number, response);
		});
	app.get('/auth/linkedin/callback', passport.authenticate('linkedin', {
		  successRedirect: '/account',
		  failureRedirect: '/contacts'
		}));
		app.post('/v1/contacts/', function(request, response) {
		  _v1.update(Contact, request.body, response)
		});
		app.put('/v1/contacts/', function(request, response) {
		  _v1.create(Contact, request.body, response)
		});
		app.del('/v1/contacts/:primarycontactnumber', function(request, 
		response) {
		    _v1.remove(Contact, request.params.primarycontactnumber, 
		response);
		});
		/*app.get('/contacts', function(request, response) {
		  response.writeHead(301, {'Location' : '/v1/contacts/'});
		  response.end('Version 1 is moved to /contacts/: ');
		});*/
		app.get('/logout', function(req, res){
			request.logout();
			  response.redirect('/contacts');
			});
		//Here is the part of the version 2 where we query by arg
		app.get('/contacts', cache('minutes',1),function(request, response) {
			  var get_params = url.parse(request.url, true).query;
			  if (Object.keys(get_params).length == 0)
			  {
			    _v1.list(Contact, response);
			  }
			  else
			  {
			    var key = Object.keys(get_params)[0];
			    var value = get_params[key];
			    JSON.stringify(_v1.query_by_arg(Contact, key, value, response));
			  }
			});
		
		

		
				console.log('Running at port ' + app.get('port'));
				http.createServer(app).listen(app.get('port'));
	
