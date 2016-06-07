var async = require('async');
var Promise = require("bluebird");
var mongoose = require('mongoose');
Promise.promisifyAll(mongoose) ;
	
	//CRUD function exporting
	
	
	exports.remove = function (model, _primarycontactnumber, response)
	{
	  console.log('Deleting contact with primary number: ' +  
	_primarycontactnumber);
	  model.findOne({primarycontactnumber: _primarycontactnumber},
	  function(error, data) {
	    if (error) {
	      console.log(error);
	      if (response != null) {
	        response.writeHead(500, {'Content-Type' : 'text/plain'});
	        response.end('Internal server error');
	      }
	      return;
	    } else {
	      if (!data) {
	        console.log('not found');
	        if (response != null) {
	          response.writeHead(404,
	            {'Content-Type' : 'text/plain'});
	          response.end('Not Found');
	        }
	        return;
	        } else {
	          data.remove(function(error){
	            if (!error) {
	              data.remove();
	            }
	            else {
	              console.log(error);
	            }
	          });
	          if (response != null){
	              response.send('Deleted');
	            }
	            return;
	          }
	        }
	      });
	    }
	//Update
	
	exports.update = function (model, requestBody, response) {
		var primarynumber = requestBody.primarycontactnumber;
		console.log("Here we are") ;
		console.log(primarynumber) ;
		  model.findOne({primarycontactnumber: primarynumber},
		    function(error, data) {
		  if (error) {
		    console.log(error);
		    if (response != null) {
		      response.writeHead(500,
		        {'Content-Type' : 'text/plain'});
		      response.end('Internal server error');
		        }
		      return;
		    } else {
		      var contact = toContact(requestBody, model);
		      if (!data) {
		        console.log('Contact with primary number: '+ primarynumber 
		+ ' does not exist. The contact will be created.');
		        contact.save(function(error) {
		          if (!error)
		          contact.save();
		        });
		       
		        if (response != null) {
		          response.writeHead(201,
		            {'Content-Type' : 'text/plain'});
		          response.end('Created');
		        }
		        return;
		      }
		      //poulate the document with the updated values
		     
		        data.firstname = contact.firstname;
		        data.lastname = contact.lastname;
		        data.title = contact.title;
		        data.company = contact.company;
		        data.jobtitle = contact.jobtitle;
		        data.primarycontactnumber = contact.primarycontactnumber;
		        data.othercontactnumbers = contact.othercontactnumbers;
		        data.emailaddresses = contact.emailaddresses;
		        data.primaryemailaddress = contact.primaryemailaddress;
		        data.groups = contact.groups;
		        // now save
		        data.save(function (error) {
		        if (!error) {
		          console.log('Successfully updated contact with primary number: '+ primarynumber);
		          data.save();
		        } else {
		          console.log('error on save');
		        }
		      });
		        if (response != null) {
		          response.send('Updated');
		        }
		      }
		    });
		  };
		  //CREATE
		  exports.create = function (model, requestBody, response) {
			  var contact = toContact(requestBody, model);
			  var primarynumber = requestBody.primarycontactnumber;
			  contact.save(function(error) {
			    if (!error) {
			      contact.save();
			    } else {
			        console.log('Checking if contact saving failed due to already existing primary number:' + primarynumber);
			        model.findOne({primarycontactnumber: primarynumber},
			        function(error, data) {
			          if (error) {
			            console.log(error);
			            if (response != null) {
			              response.writeHead(500,
			                {'Content-Type' : 'text/plain'});
			              response.end('Internal server error');
			            }
			            return;
			            } else {
			              var contact = toContact(requestBody, model);
			              if (!data) {
			                console.log('The contact does not exist. It will be created');
			                contact.save(function(error) {
			                  if (!error) {
			                    contact.save();
			                    } else {
			                      console.log(error);
			                    }
			                  });
			                  if (response != null) {
			                    response.writeHead(201,
			                      {'Content-Type' : 'text/plain'});
			                    response.end('Created');
			                }
			                return;
			              } else {
			                console.log('Updating contact with primary contact number:' + primarynumber);
			                data.firstname = contact.firstname;
			                data.lastname = contact.lastname;
			                data.title = contact.title;
			                data.company = contact.company;
			                data.jobtitle = contact.jobtitle;
			                data.primarycontactnumber =contact.primarycontactnumber;
			                data.othercontactnumbers = 
			                	contact.othercontactnumbers;
			                	              data.emailaddresses = contact.emailaddresses;
			                	              data.primaryemailaddress =  
			                	contact.primaryemailaddress;
			                	              data.groups = contact.groups;
			                	              data.save(function (error) {
			                	                if (!error) {
			                	                  data.save();
			                	                  response.end('Updated');
			                	                  console.log('Successfully Updated contat with primary contact number: ' + primarynumber);
			                	                } else {
			                	                  console.log('Error while saving contact with primary contact number:' + primarynumber);
			                	                  console.log(error);
			                	                }
			                	              });
			                	            }
			                	          }
			                	        });
			                	      }
			                	    });
			                	};

			                	
			                	function toContact(body, Contact) {
			                		  return new Contact(
			                		  {
			                		    firstname: body.firstname,
			                		    lastname: body.lastname,
			                		    title: body.title,
			                		    company: body.company,
			                		    jobtitle: body.jobtitle,
			                		    primarycontactnumber: body.primarycontactnumber,
			                		    primaryemailaddress: body.primaryemailaddress,
			                		      emailaddresses: body.emailaddresses,
			                		      groups: body.groups,
			                		      othercontactnumbers: body.othercontactnumbers
			                		    });
			                		  }	
			                /*	exports.findByNumber = function (model, _primarycontactnumber, 
			                			response) {
			                			  model.findOne({primarycontactnumber: _primarycontactnumber},
			                			function(error, result) {
			                			    if (error) {
			                			      console.error(error);
			                			      response.writeHead(500,
			                			        {'Content-Type' : 'text/plain'});
			                			      response.end('Internal server error');
			                			      return;
			                			    } else {
			                			      if (!result) {
			                			        if (response != null) {
			                			        response.writeHead(404, {'Content-Type' : 'text/plain'});
			                			        response.end('Not Found');
			                			      }
			                			      return;
			                			    }
			                			    if (response != null){
			                			      response.setHeader('Content-Type', 'application/json');
			                			        response.send(result);
			                			      }
			                			      console.log(result);
			                			    }
			                			  });
			                			}*/
			                	
			                	exports.list = function (model, response) {
			                		var p1= model.findAsync({});
			                		p1.then( function(result) {
			                		    
			                		    if (response != null) {
			                		      response.setHeader('content-type', 'application/json');
			                		      
			                		      response.end(JSON.stringify(result));
			                		    }
			                		    return JSON.stringify(result);
			                		  }) 
			                		}
			                	
			                	
			                /*	exports.query_by_arg = function (model, key, value, response) {
			                		  //build a JSON string with the attribute and the value
			                		  var filterArg = '{\"'+key + '\":' +'\"'+ value + '\"}';
			                		  var filter = JSON.parse(filterArg);
			                		  
			                		  model.find ( filter, function(error, result) {
				                		    if (error) {
				                		      console.error(error);
				                		      response.writeHead(500, {'Content-Type' : 'text/plain'});
				                		      response.end('Internal server error');
				                		      return;
				                		    } else {
				                		      if (!result) {
				                		        if (response != null) {
				                		         response.writeHead(404, {'Content-Type' : 'text/plain'});
				                		         response.end('Not Found');
				                		        }
				                		        return;
				                		      }
				                		      if (response != null){
				                		        response.setHeader('Content-Type', 'application/json');
				                		        response.send(result);
				                		      }
				                		    }
				                		  });
			                		  async.parallel([function(callback) {
			                			  model.find ( filter, function(error, response) {
					                		    if (error) {
					                		      console.error(error);
					                		      response.writeHead(500, {'Content-Type' : 'text/plain'});
					                		      response.end('Internal server error');
					                		      return;
					                		    } else {
					                		      if (!response) {
					                		        if (response != null) {
					                		         response.writeHead(404, {'Content-Type' : 'text/plain'});
					                		         response.end('Not Found');
					                		        }
					                		        return;
					                		      }
					                		      if (response != null){
					                		        response.setHeader('Content-Type', 'application/json');
					                		        
					                		        return res.send(response);
					                		       // callback(null, result);
					                		      
					                		      }
					                		    } }
					                		    
					                		    
					                		  );
			                			  
			                			  callback(null, 'done');
			                		    },], function(err, results) {
			                			    this code will run after all calls finished the job or
			                			       when any of the calls passes an error 
			                			    if (err)
			                			        return console.log(err);
			                			   
			                			    	if (results != null){
			                			    		//results[0].setHeader('Content-Type', 'application/json');
					                		        
					                		        //return res.send(results[0]);
					                		       
				                		        
				                		        
				                		        console.log(results[0]) ;
				                		    
			                			    
			                			} });
			                		  
			                		  
			                		}; */
			                		
			                		
			                		exports.query_by_arg = function ( model, key, value, response) {
			                			  //build a JSON string with the attribute and the value
			                			Promise.promisifyAll(model);
		                				Promise.promisifyAll(model.prototype);
			                			  var filterArg = '{\"'+key + '\":' +'\"'+ value + '\"}';
			                			  var filter = JSON.parse(filterArg);
			                			  model.findAsync(filter).then( function( result) {
			                			    
			                			      if (!result) {
			                			        if (response != null) {
			                			         response.writeHead(404, {'Content-Type' : 'text/plain'});
			                			         response.end('Not Found');
			                			        }
			                			        return;
			                			      }
			                			      if (response != null){
			                			        response.setHeader('Content-Type', 'application/json');
			                			        response.send(result);
			                			      }
			                			    })
			                			 
			                			};
			                			
			                			exports.findByNumber = function ( model, _primarycontactnumber, 
					                			response) {
			                				Promise.promisifyAll(model);
			                				Promise.promisifyAll(model.prototype);
					                		model.findOneAsync({primarycontactnumber: _primarycontactnumber}).then(
					                			function(result) {
					                			    
					                			      if (!result) {
					                			        if (response != null) {
					                			        response.writeHead(404, {'Content-Type' : 'text/plain'});
					                			        response.end('Not Found');
					                			      }
					                			      return;
					                			    }
					                			    if (response != null){
					                			      response.setHeader('Content-Type', 'application/json');
					                			        response.send(result);
					                			      }
					                			      console.log(result);
					                			    })
					                			 
					                			}
			                	
	
