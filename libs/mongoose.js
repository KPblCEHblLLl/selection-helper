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


const FragmentDescription = new Schema({
	name: {type: String, required: true},
	description: {type: String, required: false},
});
const FragmentDescriptionModel = mongoose.model('FragmentDescription', FragmentDescription);


const FragmentAccumulationItem = new Schema({
	fragmentDescription: {type: Schema.Types.ObjectId, required: false},
	description: {type: String, required: false},
});
const FragmentAccumulation = new Schema({
	date: {type: Date},
	list: [FragmentAccumulationItem],
});
const FragmentAccumulationModel = mongoose.model('FragmentAccumulation', FragmentAccumulation);

module.exports.LogItemModel = LogItemModel;
module.exports.FragmentDescriptionModel = FragmentDescriptionModel;
module.exports.FragmentAccumulation = FragmentAccumulation;