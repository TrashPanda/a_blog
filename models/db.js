//db module setup, 'mongodb' node driver module is the key
//we deal with the db RESTful api here
var settings = require('../settings');
var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;



var db = new Db(
  settings.db,
  new Server(settings.host, settings.port),
  {safe: true}
);



module.exports = db;
