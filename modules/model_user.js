var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	oauthID: Number,
	email:String,
	  name: String,
	  created: Date
});
module.exports = mongoose.model('user', userSchema);