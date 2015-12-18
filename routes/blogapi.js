/*
  RESTful api, writen to be used by frontend script
*/


var express = require('express');
var router = express.Router();
var Post = require('../models/post.js');      // require the post model
var User = require('../models/user.js');      // require user model

/*
/post         : empty;  GET all articles
/post         : JSON;   POST create an article
/post/u/:name : empty;  GET all articles from user:name
/post/:id     : empty;  GET an article from id:id
/post/:id     : JSON;   PUT update
/post/:id     : empty;  DELETE an article

*/

//api testing
router.route('/test')
  .get(function(req, res){
    res.send('api testing success');
  });


// GET all articles or create
router.route('/post')
  //GET all articles
  .get(function(req, res){
    Post.getAll(null, function(err, posts){
      //deal with error
      if (err) {
        res.send(err);
      }
      //responds with all posts in JSON data
      res.json(posts);
    });
  })
  .post();



//GET all articles from user:name
router.route('/post/u/:name')
  .get(function(req, res){
    User.get(req.params.name, function(err, user){
      /*do i need this part???
      //if the user doesn't exist flash the message and redirect back
      if (!user) {
        return urlRedirect(req, res, 'error',  'The user does not exist!', '/');
      }
      */
      Post.getAll(user.name, function(err, posts){
        //deal with error
        if (err) {
          res.send(err);
        }
        //responds with all posts for user:name
        res.json(posts);
      });
    })
  });







//check user state
// the page requires logged-in user
function checkLogin(req, res, next) {
  if (!req.session.user) {
    return urlRedirect(req, res, 'error', 'Please login first!', '/login');
  }
  next();
};

//redirect the url based on flag
var urlRedirect = function(req, res, key, msg, url){
    req.flash(key, msg);
    return res.redirect(url);
};



module.exports = router;
