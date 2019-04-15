const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db.sqlite3');

db.run('CREATE TABLE IF NOT EXISTS comic (name TEXT, year INT, month INT, day INT)');

db.cachedComics=()=>({});

module.exports = db;