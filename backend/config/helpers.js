const Mysqli = require('mysqli');

let conn = new Mysqli({
  host: 'db',
  post: 3306,
  user: 'root',
  passwd: 'pass',
  db: 'db'
});

let db = conn.emit(false, '');
module.exports = {
  database: db
}