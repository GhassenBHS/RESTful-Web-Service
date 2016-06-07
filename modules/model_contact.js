var mongoose = require('mongoose');
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
		
	
	
    
	module.exports = mongoose.model('Contact', contactSchema);