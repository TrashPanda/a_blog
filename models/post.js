var mongodb = require('mongodb').Db;
var ObjectID = require('mongodb').ObjectID;
var settings = require('../settings');


//CRUD api
//the CRUD operations can be done by calling the functions from mongoDB api

//the Post class, 3 properties to be saved
//name: name of the user who wrote the post
//title: title of the post
//post: body of the post
function Post(name, title, post) {
  this.name = name;
  this.title = title;
  this.post = post;
}



// the static/object methods are used directly to perform RUD operations
// Post.prototype.save is a class method. To perform a CREATE operation, an instance of the class needs to be created then .save can be called


//Post.prototype.save to save the ariticle
Post.prototype.save = function(callback) {
  var date = new Date();                    //instantiate a Date object to define various time stamp for the usage
  var time = {
      date: date,
      year : date.getFullYear(),
      month : date.getFullYear() + "-" + (date.getMonth() + 1),
      day : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
      minute : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
  };
  //document to be saved into the db,
  var post = {
      name: this.name,
      time: time,
      title: this.title,
      post: this.post
  };
  //open the db and save the document to the db
  //settings.url: db destination
  mongodb.connect(settings.url, function (err, db) {
    //check db error
    if (err) {
      return callback(err);
    }
    //read the posts collection
    db.collection('posts', function (err, collection) {
      if (err) {
        db.close();
        return callback(err);
      }
      //insert the post into posts
      // the collection.insert() function from db saves it to db
      collection.insert(post, { safe: true }, function (err) {
        db.close();
        if (err) {
          return callback(err);                               //if there is an error, callback() function is invoked and returned at this point with err
        }
        callback(null);                                       //otherwise callback() is invoked with null passed
      });
    });
  });
};


//Get all articles from all users or 1 user
//name: user's name
//callback(): which has retrieved documents is invoked at the end
Post.getAll = function(name, callback) {
  //db operation
  mongodb.connect(settings.url, function (err, db) {
  //mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //retrieve articles from collections
    db.collection('posts', function(err, collection) {
      if (err) {
        db.close();
        return callback(err);
      }
      //if user's name present, set query as user's name
      var query = {};
      if (name) {
        query.name = name;
      }
      //find the posts from collection
      collection.find(query).sort({
        time: -1
      }).toArray(function (err, docs) {
        db.close();
        if (err) {
          return callback(err);
        }
        callback(null, docs);   //return the articles to the callback function
      });
    });
  });
};


//Server-side pagination. Problem: no total count returned
//
//to get 10 articles per pages
//Note: get 6 for current state, 10 is too big for now
// name: inquried user's name
// page: the current page number
// limit: to set the limit of the posts in one page
//callback(): which has retrieved documents and the total count is invoked at the end
Post.getSome = function(name, limit, page, callback) {
  mongodb.connect(settings.url, function (err, db) {
    //check db error
    if (err) {
      return callback(err);
    }
    //db operation
    db.collection('posts', function (err, collection) {
      //posts error checking
      if (err) {
        db.close();
        return callback(err);
      }
      //query object to be passed to in collection.count()
      var query = {};

      // if name is passed(indicating user name), let query have name property
      if (name) {
        query.name = name;
      }

      // the count function counts the number of matches according to query,
      //in this case the query is .name (optional) as above
      // the count result has to be returned actively, here we use a call back to return both the counts and the number of document
      collection.count(query, function (err, count) {
        collection.find(query, {
          skip: (page - 1)*limit,                       // skip (page-1)*10 results and jump to the following
          limit: limit                                  // the most number of documents to be returned
        }).sort({
          time: -1                                      // sort by descending order of time, newest first. note when sort() limit() are used togather,the mongoDB will always sort first then apply limit, it's not the case of placement. In this case the newest document are at the front
        }).toArray(function (err, docs) {
          db.close();
          if (err) {
            return callback(err);
          }
          callback(null, docs, count);              // pass back the documents, and the total of them
        });
      });
    });
  });
};


//retrieve one article
Post.getOne = function(_id, callback) {
  //open db
  mongodb.connect(settings.url, function (err, db) {
    if (err) {
      return callback(err);
    }
    //read posts collection
    db.collection('posts', function (err, collection) {
      if (err) {
        db.close();
        return callback(err);
      }
      //query through _id
      collection.findOne({
        "_id": new ObjectID(_id)
      }, function (err, doc) {
        db.close();
        if (err) {
          return callback(err);
        }
        callback(null, doc);  //return the result
      });
    });
  });
};




//Post.update to update the change of the article
Post.update = function(_id, title, post, callback) {
  mongodb.connect(settings.url, function (err, db) {
    //check db error
    if (err) {
      return callback(err);
    }
    //read posts collections
    db.collection('posts', function (err, collection) {
      if (err) {
        db.close();
        return callback(err);
      }
      //update the article
      collection.update( { "_id": new ObjectID(_id)  }, {
        $set: {
          post: post,
          title: title
        }
      }, function (err) {
        db.close();
        if (err) {
          return callback(err);
        }
        callback(null);
      });
    });
  });
};

//Post.remove to remove one article
Post.remove = function(_id, callback) {
  mongodb.connect(settings.url, function (err, db) {
    //check db error
    if (err) {
      return callback(err);
    }
    //using collection to remove
    db.collection('posts', function (err, collection) {
      if (err) {
        db.close();
        return callback(err);
      }
      //remove that article
      collection.remove( { "_id": new ObjectID(_id) }, { w: 1 }, function (err) {
        db.close();
        if (err) {
          return callback(err);
        }
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
