const express = require('express');
const bodyParser = require('body-parser');
// var methodOverride = require('method-override');
const path = require('path'); // модуль для парсинга пути
const log = require('./libs/log')(module);
const config = require('./libs/config');

const app = express();

app.use(bodyParser.urlencoded({extended: true})); // стандартный модуль, для парсинга JSON в запросах
// app.use(methodOverride('X-HTTP-Method-Override', {methods: ['POST', 'PUT', 'DELETE']})); // поддержка put и delete
app.use(express.static(path.join(__dirname, "dist/public"))); // запуск статического файлового сервера, который смотрит на папку public/ (в нашем случае отдает index.html)

require('./api/log-item')(app, log);

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