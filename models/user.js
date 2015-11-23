//check mongodb node driver api http://mongodb.github.io/node-mongodb-native/2.0/api/Db.html#collection
//var mongodb = require('./db');
var mongodb = require('mongodb').Db;
var settings = require('../settings');


//a User class
function User(user) {
  this.name = user.name;
  this.password = user.password;
  this.email = user.email;
};




//User.save to store user info
//1 proerty, .user
User.prototype.save = function(callback) {
  //the user document to be saved
  var user = {
      name: this.name,
      password: this.password,
      email: this.email
  };
  //open the db
  mongodb.connect(settings.url, function (err, db) {
    if (err) {
      return callback(err);
    }
    //read the user collection
    db.collection('users', function (err, collection) {
      if (err) {
        db.close();
        return callback(err); //if there is a error return err message
      }
      //insert user data into users collection
      collection.insert(user, { safe: true }, function (err, user) {
        db.close();
        if (err) {
          return callback(err);
        }
        callback(null, user[0]); //if success,err is passed as null and return the saved user document
      });
    });
  });
};

//User.get to inquire the user info
User.get = function(name, callback) {
  mongodb.connect(settings.url, function (err, db) {
    if (err) {
      return callback(err);
    }
    //read users collection
    db.collection('users', function (err, collection) {
      if (err) {
        db.close();
        return callback(err); //if there is a error return err message
      }
      //user info inquery, in the key=name
      collection.findOne({
        name: name
      }, function (err, user) {
        db.close();
        if (err) {
          return callback(err);
        }
        callback(null, user);//success, return the inquired user info
      });
    });
  });
};



//if there is a error, the error message will be passed to the callback and returned.
var dbErrorCheck =  function(err, callback){
  if (err) {
    return callback(err);
  }
};

module.exports = User;
