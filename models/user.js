//check mongodb node driver api http://mongodb.github.io/node-mongodb-native/2.0/api/Db.html#collection
var mongodb = require('./db');


//a User class
//3 properties, .name, .password, .email
//2 main method, .save(), .get()
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
  mongodb.open(function (err, db) {
    dbErrorCheck(err, callback);
    //read the user collection
    db.collection('users', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err); //if there is a error return err message
      }
      //insert user data into users collection
      collection.insert(user, { safe: true }, function (err, user) {
        mongodb.close();
        dbErrorCheck(err, callback);
        callback(null, user[0]); //if success,err is passed as null and return the saved user document
      });
    });
  });
};

//User.get to inquire the user info
User.get = function(name, callback) {

  mongodb.open(function (err, db) {
    dbErrorCheck(err, callback);
    //read users collection
    db.collection('users', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err); //if there is a error return err message
      }
      //user info inquery, in the key=name
      collection.findOne({
        name: name
      }, function (err, user) {
        mongodb.close();
        dbErrorCheck(err, callback);
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
