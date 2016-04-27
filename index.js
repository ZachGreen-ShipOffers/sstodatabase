var config = require('./config');
var pg = require('./db');
var moment = require('moment-timezone');
var db = pg.db;
var pgp = pg.pgp;
// var AWS = require('aws-sdk')
// AWS.config.loadFromPath('./aws_config.json')

exports.handler = function (event, context, cb) {
    var orders = event.orders;
    db.tx(function (t) {
            var q = [];
            for (var o in orders) {
                if (orders.hasOwnProperty(o)) {
                    console.log("Id: ", orders[o].id);
                    q.push(t.any('select * from create_order_from_json($1:json)', [orders[o]]));
                }
            }
            return t.batch(q);
        })
        .then(function (data) {
            cb(null, data);
        })
        .catch(function (err) {
            cb(err);
        })
        .finally(pgp.end);
};
