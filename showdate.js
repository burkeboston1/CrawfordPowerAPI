// app/models/showdate.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ShowDateSchema = new Schema({
	date:  	  Date,	  // date and time
	venue: 	  String, // name of venue
	location: String  // City, ST
})

module.exports = mongoose.model('ShowDate', ShowDateSchema);