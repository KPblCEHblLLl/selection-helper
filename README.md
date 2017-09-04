mongod
node server.js

mongoexport --db selection-helper --collection logitems --out dump.json
mongoimport --db selection-helper --collection logitems --file dump.json
