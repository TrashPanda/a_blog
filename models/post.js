var mongodb = require('./db');
var ObjectID = require('mongodb').ObjectID;




//the Post class,
//2 methods .save, .get
function Post(name, title, post) {
  this.name = name;
  this.title = title;
  this.post = post;
}


//Post.save to save the ariticle
Post.prototype.save = function(callback) {
  var date = new Date();
  //save multiple format, just in case
  var time = {
      date: date,
      year : date.getFullYear(),
      month : date.getFullYear() + "-" + (date.getMonth() + 1),
      day : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
      minute : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
  };
  //document to save into the db,
  var post = {
      name: this.name,
      time: time,
      title: this.title,
      post: this.post
  };
  //open the db
  mongodb.open(function (err, db) {
    dbErrorCheck(err, callback);
    //read the posts collection
    db.collection('posts', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //insert the post into posts
      collection.insert(post, {                               // THE LINE WHICH SAVES
        safe: true
      }, function (err) {
        mongodb.close();
        dbErrorCheck(err, callback);
        callback(null);//otherwise err will be null
      });
    });
  });
};

//Post.getAll to get the a series of articles, be all or from one user
Post.getAll = function(name, callback) {
  //open db
  mongodb.open(function (err, db) {
    dbErrorCheck(err, callback);
    //read posts collection
    db.collection('posts', function(err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      var query = {};
      if (name) {                   //if there is a name passed as param, then use name as key to query
        query.name = name;
      }
      //use query to find post, here query is the cursor of db, if query = {}, return all. if query = {name: name}, we have the key to search
      collection.find(query).sort({
        time: -1
      }).toArray(function (err, docs) {
        mongodb.close();
        dbErrorCheck(err, callback);
        callback(null, docs);//if succcessfull, return the document
      });
    });
  });
};

//to get 10 posts per pages
Post.getTen = function(name, page, callback) {

  mongodb.open(function (err, db) {
    dbErrorCheck(err, callback);
    db.collection('posts', function (err, collection) {
      //posts error checking
      if (err) {
        mongodb.close();
        return callback(err);
      }
      var query = {};
      if (name) {
        query.name = name;
      }      
      collection.count(query, function (err, total) {
        // skip (page-1)*10 results and display 10 results at page page.
        collection.find(query, {
          skip: (page - 1)*10,
          limit: 10
        }).sort({
          time: -1
        }).toArray(function (err, docs) {
          mongodb.close();
          if (err) {
            return callback(err);
          }
          callback(null, docs, total);
        });
      });
    });
  });
};


//retrieve one article
Post.getOne = function(_id, callback) {
  //open db
  mongodb.open(function (err, db) {
    dbErrorCheck(err, callback);
    //read posts collection
    db.collection('posts', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //query through _id
      collection.findOne({
        "_id": new ObjectID(_id)
      }, function (err, doc) {
        mongodb.close();
        dbErrorCheck(err, callback);
        callback(null, doc);  //return the result
      });
    });
  });
};




//Post.update to update the change of the article
Post.update = function(_id, title, post, callback) {
  //open the database
  mongodb.open(function (err, db) {
    dbErrorCheck(err, callback);
    //read posts collections
    db.collection('posts', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //update the article
      collection.update({
        "_id": new ObjectID(_id)
      }, {
        $set: {
          post: post,
          title: title
        }
      }, function (err) {
        mongodb.close();
        dbErrorCheck(err, callback);
        callback(null);
      });
    });
  });
};

//Post.remove to remove one article
Post.remove = function(_id, callback) {
  //open db
  mongodb.open(function (err, db) {
    dbErrorCheck(err, callback);
    //using collection to remove
    db.collection('posts', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //remove that article
      collection.remove({
        "_id": new ObjectID(_id)
      }, {
        w: 1
      }, function (err) {
        mongodb.close();
        dbErrorCheck(err, callback);
        callback(null);
      });
    });
  });
};




function dbErrorCheck(err, callback){
  if (err) {
    return callback(err);
  }
};

module.exports = Post;
