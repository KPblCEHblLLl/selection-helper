var express = require('express');
var bodyParser = require('body-parser');
// var methodOverride = require('method-override');
var path = require('path'); // модуль для парсинга пути
var log = require('./libs/log')(module);
var config = require('./libs/config');
var LogItemModel = require('./libs/mongoose').LogItemModel;

var app = express();

app.use(bodyParser.urlencoded({extended: true})); // стандартный модуль, для парсинга JSON в запросах
// app.use(methodOverride('X-HTTP-Method-Override', {methods: ['POST', 'PUT', 'DELETE']})); // поддержка put и delete
app.use(express.static(path.join(__dirname, "public"))); // запуск статического файлового сервера, который смотрит на папку public/ (в нашем случае отдает index.html)

app.get('/api', function(req, res) {
	res.send('API is running');
});

app.get('/api/log-item', function(req, res) {
	let sortField = req.query["sortField"] || "created";
	let filter = {};
	let lastDate = req.query["lastDate"];
	let tags = req.query["tags"];
	if (tags) {
		filter["tags"] = tags;
	}
	if (lastDate) {
		filter[sortField] = {$lt: lastDate}
	}

	return LogItemModel.find(filter, null, {
		skip: 0,
		limit: 10,
		sort: {
			[sortField]: -1
		}
	}, function(err, logItemsList) {
		if (!err) {
			return res.send(logItemsList);
		} else {
			res.statusCode = 500;
			log.error('Internal error(%d): %s', res.statusCode, err.message);
			return res.send({error: 'Server error'});
		}
	})
});

app.post('/api/log-item', function(req, res) {
	let logItem = new LogItemModel({
		title: req.body.title,
		text: req.body.text,
		tags: req.body.tags,
	});

	logItem.save(function(err) {
		if (!err) {
			log.info("log item created");
			return res.send({status: 'OK', logItem: logItem});
		} else {
			console.log(err);
			if (err.name === 'ValidationError') {
				res.statusCode = 400;
				res.send({error: 'Validation error'});
			} else {
				res.statusCode = 500;
				res.send({error: 'Server error'});
			}
			log.error('Internal error(%d): %s', res.statusCode, err.message);
		}
	});
});

app.get('/api/log-item/:id', function(req, res) {
	return LogItemModel.findById(req.params.id, function(err, logItem) {
		if (!logItem) {
			res.statusCode = 404;
			return res.send({error: 'Not found'});
		}
		if (!err) {
			return res.send({status: 'OK', logItem: logItem});
		} else {
			res.statusCode = 500;
			log.error('Internal error(%d): %s', res.statusCode, err.message);
			return res.send({error: 'Server error'});
		}
	});
});

app.put('/api/log-item/:id', function(req, res) {
	return LogItemModel.findById(req.params.id, function(err, logItem) {
		if (!logItem) {
			res.statusCode = 404;
			return res.send({error: 'Not found'});
		}

		logItem.title = req.body.title;
		logItem.text = req.body.text;
		logItem.tags = req.body.tags;
		logItem.modified = new Date();

		return logItem.save(function(err) {
			if (!err) {
				log.info("logItem updated");
				return res.send({status: 'OK', logItem: logItem});
			} else {
				if (err.name === 'ValidationError') {
					res.statusCode = 400;
					res.send({error: 'Validation error'});
				} else {
					res.statusCode = 500;
					res.send({error: 'Server error'});
				}
				log.error('Internal error(%d): %s', res.statusCode, err.message);
			}
		});
	});
});

app.delete('/api/log-item/:id', function(req, res) {
	return LogItemModel.findById(req.params.id, function(err, logItem) {
		if (!logItem) {
			res.statusCode = 404;
			return res.send({error: 'Not found'});
		}
		return logItem.remove(function(err) {
			if (!err) {
				log.info("logItem removed");
				return res.send({status: 'OK'});
			} else {
				res.statusCode = 500;
				log.error('Internal error(%d): %s', res.statusCode, err.message);
				return res.send({error: 'Server error'});
			}
		});
	});
});

// app.listen(config.get("port"), function () {
app.listen(1137, function() {
	console.log('Express server listening on port 1137');
});

app.use(function(req, res, next) {
	res.status(404);
	log.debug('Not found URL: %s', req.url);
	res.send({error: 'Not found'});
});

app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	log.error('Internal error(%d): %s', res.statusCode, err.message);
	res.send({error: err.message});
});

app.get('/ErrorExample', function(req, res, next) {
	next(new Error('Random error!'));
});