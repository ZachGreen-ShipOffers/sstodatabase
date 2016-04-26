var config = require('./config');
var pg = require('./db');
var moment = require('moment-timezone');
var db = pg.db;
var pgp = pg.pgp;
// var AWS = require('aws-sdk')
// AWS.config.loadFromPath('./aws_config.json')

exports.handler = function(event, context, cb) {
  var orders = event.orders
  db.tx(function(t) {
    var q = []
    for (var o in orders) {
      console.log("Id: " + orders[o].id);
      q.push(t.func('create_order_from_json', JSON.stringify(orders[o])))
    }
    return t.batch(q);
  })
  .then(function(data) {
    cb(null, data)
  })
  .catch(function(err) {
    cb(err)
  })
  .done(function() {pgp.end();})
}
