/*
  router version 0.1

*/


var express = require('express');
var router = express.Router();
var crypto = require('crypto');               // encryption
var User = require('../models/user.js');      // require user model
var Post = require('../models/post.js');      // require the post model


/*
Routing Pages:

visible to all users
/       : main

visible to logouted user only
/login  : login
/reg    : registration

visible to logined user only
/logout : logout
/post   : post new article
*/


//route to backbone app
// in development
/*
router.route('/')
  //GET req for new portal at /new
  .get(function(req,res){
    res.render('newIndex',{
      title: "A Blog",
      user: req.session.user,                           //current user check
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
*/


/*old version*/
//homepage with 10 articles per page
router.route('/')
  //GET req at /
  .get(function (req, res) {
    //page is at either 1 or page p
    var page = parseInt(req.query.p) || 1;
    //return the 10 results from page p
    Post.getTen(null, page, function (err, posts, total) {
      if (err) {
        posts = [];
      }

      //serve the index.ejs page to root url /
      res.render('index', {
        title: "TrashPanda's Coding den",
        posts: posts,
        page: page,
        isFirstPage: (page - 1) == 0,                                     //navigation handling
        isLastPage: ((page - 1) * 10 + posts.length) == total,
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
      });
    });
  });


/*registration page*/
router.route('/reg')
  .all(checkNotLogin)       //the user has to be in the not logged-in state to be on this page
  //GET at /reg
  .get(function(req, res){
    res.render('reg', {
      title: 'Registration',
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  })
  //POST req at /reg
  .post(function(req, res){
    var name = req.body.name;
    var password = req.body.password;
    var password_re = req.body['password-repeat'];
    //check if the password inputs are the same
    if (password_re != password) {
      return urlRedirect(req, res, 'error', 'Passwords entered have to be the same!', '/reg');
    }
    //create md5 hash
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('hex');

    //instantiate a User object with information to be saved
    var newUser = new User({
        name: name,
        password: password,
        email: req.body.email
    });
    //check if the newUser.name exist, if not then call User.save to the db
    User.get(newUser.name, function (err, user) {
      //checking before saving
      //error! goes back to root /
      if (err) {
        return urlRedirect(req, res, 'error', err, '/');
      }
      //if the user exists routes back to the registration page
      if (user) {
        return urlRedirect(req, res, 'error', 'The user already exists!', '/reg');
      }

      //after checking,save the user info
      //if not add new user data, newUser calls User.save here
      newUser.save(function (err, user) {
        //error! goes back to the url
        if (err) {
          return urlRedirect(req, res, 'error', err, '/');
        }
        req.session.user = user;                                             //save the user info into session
        urlRedirect(req, res, 'success', 'Registration successful!', '/');   //and back to the homepage
      });
    });
  });



/*login page, GET POST request*/
router.route('/login')
  .all(checkNotLogin)      //the user has to be in the not logged-in state to be on this page
  //GET req at /login
  .get(function(req, res){
    res.render('login', {
      title: 'Login',
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  })
  //POST req at /login
  .post(function(req, res){
    //password encryption
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('hex');
    //check db User model if the current user exist
    User.get(req.body.name, function (err, user) {
      //error! goes back to the url
      if (err) {
        return urlRedirect(req, res, 'error', err, '/');
      }
      //if the user doesn't exist, redirect back  to login page
      if (!user) {
        return urlRedirect(req, res, 'error', 'The user does not exist!', '/login');
      }
      //if user exist thencheck the password. if wrong, redirect to login page
      if (user.password != password) {
        return urlRedirect(req, res, 'error', 'Nice try! But wrong password!', '/login');
      }
      //if both username and password are right, store the user info into session and jump to the hompage
      req.session.user = user;
      urlRedirect(req, res, 'success', 'Logged in successful!', '/');
    });
  });


/*the new post page, CREATE new post*/
router.route('/post')
  .all(checkLogin)                //has to a logged in user to post
  //GET req at /post, this is for server side page
  .get(function(req, res){
    res.render('post', {
      title: 'Post',
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  })
  //POST req at /post
  .post(function(req, res){
    var currentUser = req.session.user;
    //instantiate an Post object to use .save().
    //Therefore session user name, post title and post body are passed as arguments
    var post = new Post(currentUser.name, req.body.title, req.body.post);
    post.save(function (err) {
      if (err) {
        return urlRedirect(req, res, 'error', err, '/');
      }
      urlRedirect(req, res, 'success', 'Submission successful!', '/');
    });
  });



//one user's page, with 10 posts per page
router.route('/u/:name')
  //GET req at /u/:name
  .get(function (req, res) {
    var page = parseInt(req.query.p) || 1;
    //check the existance of the user
    User.get(req.params.name, function (err, user) {
      if (!user) {
        return urlRedirect(req, res, 'error',  'The user does not exist!', '/');
      }
      //call Post.getTen to display 10 posts per page
      Post.getTen(user.name, page, function (err, posts, total) {
        if (err) {
          return urlRedirect(req, res, 'error', err, '/');  //error! goes back to the url
        }
        res.render('user', {
          title: user.name,
          posts: posts,
          page: page,
          isFirstPage: (page - 1) == 0,
          isLastPage: ((page - 1) * 10 + posts.length) == total,
          user: req.session.user,
          success: req.flash('success').toString(),
          error: req.flash('error').toString()
        });
      });
    });
  });

//server side page api
//render one particular article
router.route('/p/:_id')
  //GET req at '/p/:_id'
  .get(function(req, res){
    //retrieve one article from Post model
    Post.getOne(req.params._id, function (err, post) {
      if (err) {
        return urlRedirect(req, res, 'error', err, '/');  //error! goes back to the url
      }
      //responded data: title, post body, session user, success message flash, error message flash
      res.render('article', {
        title: post.title,
        post: post,
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
      });
    });
  });





//retrieve one page and provide edit function
router.route('/edit/p/:_id')
  .all(checkLogin)                                        //check the login state, it has to be a logged-in user
  //GET req at /edit/p/:_id
  .get(function(req, res){
    var currentUser = req.session.user;
    Post.getOne(req.params._id, function (err, post) {
      if (err) {
        return urlRedirect(req, res, 'error', err, '/');  //error! goes back to the url
      }
      //render function
      res.render('edit', {
        title: 'Edit',
        post: post,
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
      });
    });
  })
  //POST
  .post(function(req, res){
    var currentUser = req.session.user;
    //perform .update from Post model
    //the data is passed via name attribute of the form
    Post.update(req.params._id, req.body.title, req.body.post, function (err) {
      //construct the new url to be directed to after the update
      var url = encodeURI('/p/' + req.params._id);
      if (err) {
        return urlRedirect(req, res, 'error', err, '/');          //error! goes back to the root
      }
      urlRedirect(req, res, 'success', 'Edit successful!', url);  //if success, back to the new article url
    });
  });



router.route('/remove/p/:_id')
  .all(checkLogin)
  //GET
  .get(function(req, res){
    var currentUser = req.session.user;
    Post.remove(req.params._id, function (err) {
      if (err) {
        return urlRedirect(req, res, 'error', err, '/');  //error! goes back to the url
      }
      urlRedirect(req, res, 'success', 'Delete successful!', '/');  //delete successful
    });
  })


/*logout page*/
router.route('/logout')
  .all(checkLogin)              //has to a logged in user to log out
  //GET req at /logout
  .get(function(req, res){
    req.session.user = null;                                        //set the current session user to null
    urlRedirect(req, res, 'success', 'Log out successful!', '/');   //back to the homepage
  })




/************
RESTful api for clientside to use
/api/posts         : empty;  GET all articles
/api/posts         : JSON;   POST create an article
/api/posts/u/:name : empty;  GET all articles from user:name
/api/posts/:id     : empty;  GET an article from id:id
/api/posts/:id     : JSON;   PUT update
/api/posts/:id     : empty;  DELETE an article
*******/

//testing
router.route('/test')
  .get(function(req, res){
    res.send('api testing success');
  });


//POST an new article
//WARNING: to be tested
router.route('/api/posts')
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
  .post(checkLogin)                           //check user status, he has to be logged-in
  .post(function(req, res){
    //save the session user info
    var currentUser = req.session.user;
    //instantiate an Post object to use .save(). session user name, post title and post body are passed as arguments
    var post = new Post(currentUser.name, req.body.title, req.body.post);
    post.save(function (err) {
      //error checking
      if (err) {
        res.send(err);
      }
      //respond with success msg in json format
      res.json(
        { message: 'Submission successful!' }
      );
    });
  });




//GET/PUT/DELETE get/update/retrieve an post. _id is used to identify the document
router.route('/api/posts/:_id')
  //GET request for a post
  .get(function(req, res){
    Post.getOne(req.params._id, function(err, post){
      //deal with error
      if (err) {
        res.send(err);
      }
      //respond with post with id:_id
      res.json(post);
    });
  })
  //PUT request to update the post
  .put(checkLogin)                    //check the login state, it has to be a logged-in user to send PUT request
  .put(function(req, res){
    var currentUser = req.session.user;
    //perform .update from Post model
    //the data is passed via name attribute of the form
    Post.update(req.params._id, req.body.title, req.body.post, function (err) {
      var url = encodeURI('/p/' + req.params._id);
      if (err) {
        return urlRedirect(req, res, 'error', err, '/');          //error! goes back to the root
      }
      urlRedirect(req, res, 'success', 'Edit successful!', url);  //back to the url
    });
  })
  //DELETE request
  .delete(checkLogin)                    //check the login state, it has to be a logged-in user to send DELETE request
  .delete(function(req, res){
    var currentUser = req.session.user;
    //perform delete with .remove from Post model
    Post.remove(req.params._id, function (err) {
      if (err) {
        return urlRedirect(req, res, 'error', err, '/');  //error! goes back to the url
      }
      urlRedirect(req, res, 'success', 'Delete successful!', '/');  //delete successful
    });
  });











/***
utility functions
checkLogin(), checkNotLogin():  login status check
urlRedirect():  work with connect-flash to redirect url
***/
//check user state
// the page requires logged-in user
function checkLogin(req, res, next) {
  if (!req.session.user) {
    return urlRedirect(req, res, 'error', 'Please login first!', '/login');
  }
  next();
};

//the pages requires not-logged-in user, eg, /login, /reg
function checkNotLogin(req, res, next) {
  if (req.session.user) {
    return urlRedirect(req, res, 'error', 'Already logged in!', 'back');
  }
  next();
};



//use the connect-flash middewares,
//redirect the url based on flag, key is either 'success' or error
var urlRedirect = function(req, res, key, msg, url){
    req.flash(key, msg);
    return res.redirect(url);
};

module.exports = router;
