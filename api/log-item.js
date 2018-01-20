/**
 * Created by KPblCEHblLLl on 20.11.2017.
 */
const LogItemModel = require('../libs/mongoose').LogItemModel;

module.exports = function(app, log) {
	app.get('/api/log-item', function(req, res) {
		let sortField = req.query["sortField"] || "created";
		let filter = {};
		let lastDate = req.query["lastDate"];
		let tags = req.query["tags"];
		if (tags) {
			filter["tags"] = {"$in": tags};
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
};