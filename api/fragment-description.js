/**
 * Created by KPblCEHblLLl on 20.11.2017.
 */

const FragmentDescriptionModel = require('../libs/mongoose').FragmentDescriptionModel;

module.exports = function(app, log) {
	app.get('/api/fragment-description', function(req, res) {
		let filter = {};

		return FragmentDescriptionModel.find(filter, null, {
			skip: 0,
		}, function(err, itemsList) {
			if (!err) {
				return res.send(itemsList);
			} else {
				res.statusCode = 500;
				log.error('Internal error(%d): %s', res.statusCode, err.message);
				return res.send({error: 'Server error'});
			}
		})
	});


	app.post('/api/fragment-description', function(req, res) {
		let item = new FragmentDescriptionModel({
			name: req.body.name,
			description: req.body.description,
		});

		item.save(function(err) {
			if (!err) {
				log.info("log item created");
				return res.send({status: 'OK', item});
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

	app.get('/api/fragment-description/:id', function(req, res) {
		return FragmentDescriptionModel.findById(req.params.id, function(err, item) {
			if (!item) {
				res.statusCode = 404;
				return res.send({error: 'Not found'});
			}
			if (!err) {
				return res.send({status: 'OK', item});
			} else {
				res.statusCode = 500;
				log.error('Internal error(%d): %s', res.statusCode, err.message);
				return res.send({error: 'Server error'});
			}
		});
	});

	app.put('/api/fragment-description/:id', function(req, res) {
		return FragmentDescriptionModel.findById(req.params.id, function(err, item) {
			if (!item) {
				res.statusCode = 404;
				return res.send({error: 'Not found'});
			}

			item.name = req.body.name;
			item.description = req.body.description;

			return item.save(function(err) {
				if (!err) {
					log.info("item updated");
					return res.send({status: 'OK', item});
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

	app.delete('/api/fragment-description/:id', function(req, res) {
		return FragmentDescriptionModel.findById(req.params.id, function(err, item) {
			if (!item) {
				res.statusCode = 404;
				return res.send({error: 'Not found'});
			}
			return item.remove(function(err) {
				if (!err) {
					log.info("item removed");
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