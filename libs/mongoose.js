var mongoose = require('mongoose');
var log = require('./log')(module);
var config = require('./config');

// mongoose.connect(config.get('mongoose:uri'));
mongoose.connect("mongodb://localhost/selection-helper", {
	useMongoClient: true,
});

var Schema = mongoose.Schema;

var LogItem = new Schema({
	title: {type: String, required: false},
	text: {type: String, required: false},
	created: {type: Date, default: Date.now},
	modified: {type: Date, default: Date.now},
});

var LogItemModel = mongoose.model('LogItem', LogItem);

module.exports.LogItemModel = LogItemModel;