  var Promise = require("bluebird")
  ,express = require('express')
  , http = require('http')
  , https = require('https')
  , path = require('path')
  , bodyParser = require('body-parser')
  , logger = require('morgan')
  , methodOverride = require('method-override')
  , errorHandler = require('errorhandler')
  , mongoose = Promise.promisifyAll(require('mongoose'))
  , _v1 = require('./modules/contactdataservice_1')
  ,fs = require('fs')
  ,User = require('./modules/model_user')
  ,Contact = require('./modules/model_contact')
   ,Promise = require("bluebird");

  CacheControl = require("express-cache-control");
  var index=require('./routes/index') ;
  var user=require('./routes/user') ;

var cache = new CacheControl().middleware;

//Passport implementation
var passport = require('passport'),
var config = require('./modules/auth');
var FacebookStrategy = require('passport-facebook').Strategy;

//ssl, if you do not use https, trusted third party will not //give you a token and the browser will always get empty //response. 

var options = {
		  key: fs.readFileSync('key.pem', 'utf8'),
		  cert: fs.readFileSync('cert.pem', 'utf8')
		};




var app = express();
var url = require('url');


//config
app.configure(function() {
	  app.set('views', __dirname + '/views');
	  app.set('port', process.env.PORT || 1337);
	  app.set('view engine', 'jade');
	 // app.set('view engine', 'ejs');
	  app.use(express.logger());
	  app.use(express.cookieParser());
	  app.use(express.bodyParser());
	  app.use(bodyParser.urlencoded({
		  extended: true
		}));
	  app.use(express.methodOverride());
	  app.use(express.session({ secret: 'my_precious' }));
	  app.use(passport.initialize());
	  app.use(passport.session());
	  app.use(app.router);
	  app.use(express.static(__dirname + '/public'));
	});


// development only
if ('development' == app.get('env')) {
	  app.use(errorHandler());
	}
	mongoose.connect('mongodb://127.0.0.1:27017/test');
		
	//var User = mongoose.model('User',userSchema);
	
	//facebook ici
	passport.serializeUser(function(user, done) {
		  done(null, user);
		});
		passport.deserializeUser(function(obj, done) {
		  done(null, obj);
		});
		var User = mongoose.model('User', {
			  oauthID: Number,
			  name: String,
			  created: Date
			});
	
	// Facebook strategy implemetation
     // Here we precise which user info we want

	passport.use(new FacebookStrategy({
	  clientID: config.facebook.clientID,
	  clientSecret: config.facebook.clientSecret,
	  callbackURL: config.facebook.callbackURL
	  },
	  function(accessToken, refreshToken, profile, done) {
		  User.findOne({ oauthID: profile.id }, function(err, user) {
		      if(err) {
		        console.log(err);  // handle errors!
		      }
		      if (!err && user !== null) {
		        done(null, user);
		      } else {
		        user = new User({
		          oauthID: profile.id,
		          email: profile.emails[0].value,
		          name: profile.displayName,
		          created: Date.now()
		        });
		        user.save(function(err) {
		          if(err) {
		            console.log(err);  // handle errors!
		          } else {
		            console.log("saving user ...");
		            done(null, user);
		          }
		        });
		      }
		    });
	  }
	));

	// routes
	app.get('/', index.index);
	app.get('/ping', index.ping);
	app.get('/account', ensureAuthenticated, function(req, res){
	  res.render('account', { user: req.user });
	});

	app.get('/', function(req, res){
	  res.render('login', { user: req.user });
	});

	app.get('/auth/facebook',
	  passport.authenticate('facebook'),
	  function(req, res){});
	app.get('/auth/facebook/callback',
	  passport.authenticate('facebook', { failureRedirect: '/' }),
	  function(req, res) {
	    res.redirect('/account');
	  });

	app.get('/logout', function(req, res){
	  req.logout();
	  res.redirect('/');
	});

	// port
	//app.listen(1337);

	// test authentication
	function ensureAuthenticated(req, res, next) {
	  if (req.isAuthenticated()) { return next(); }
	  res.redirect('/');
	}
//fin
	
	
		
		
	
	
	app.get('/v1/contacts/:number',
function(request, response) {
		  console.log(request.url + ' : querying for ' + 
		request.params.number);
		  
		  _v1.findByNumber(Contact, request.params.number, response);
		  console.log(User.email) ;
		});
	
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
		
		

		
		http.createServer(app).listen(app.get('port'));
		https.createServer(options,app).listen(3000);
		console.log('Running at port ' + app.get('port'));
	

