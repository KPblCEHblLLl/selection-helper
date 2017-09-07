const mongoose = require('mongoose');
const log = require('./log')(module);
const config = require('./config');

// mongoose.connect(config.get('mongoose:uri'));
mongoose.connect("mongodb://localhost/selection-helper", {
	useMongoClient: true,
});

const Schema = mongoose.Schema;

const LogItem = new Schema({
	title: {type: String, required: false},
	text: {type: String, required: false},
	tags: {type: Array, required: false},
	created: {type: Date, default: Date.now},
	modified: {type: Date, default: Date.now},
});

const LogItemModel = mongoose.model('LogItem', LogItem);

module.exports.LogItemModel = LogItemModel;