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
/post   : article posting page
*/




//homepage with 10 articles per page
router.route('/')
  .get(function (req, res) {
    //page is at either 1 or page p
    var page = req.query.p ? parseInt(req.query.p) : 1;
    //return the 10 results from page p
    Post.getTen(null, page, function (err, posts, total) {
      if (err) {
        posts = [];
      }
      res.render('index', {
        title: "A Blog",
        posts: posts,
        page: page,
        isFirstPage: (page - 1) == 0,                                     //navigation
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
  .get(function(req, res){
    res.render('reg', {
      title: 'Registration',
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  })
  // handling the user registration POST request
  .post(function(req, res){
    var name = req.body.name;
    var password = req.body.password;
    var password_re = req.body['password-repeat'];
    //check if the password inputs are the same
    if (password_re != password) {
      req.flash('error', 'Passwords entered have to be the same!');
      return res.redirect('/reg');  //back to the registration page
    }


    //create md5 hash
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('hex');
    var newUser = new User({
        name: name,
        password: password,
        email: req.body.email
    });
    //check if the newUser.name exist if not then call User.save to the db
    User.get(newUser.name, function (err, user) {

      errorRedirect(err,'/');
      //if the user exists routes back to the registration page
      if (user) {
        req.flash('error', 'The user already exists!');
        return res.redirect('/reg');
      }
      //if not add new user data, newUser calls User.save here
      newUser.save(function (err, user) {
        errorRedirect(err, '/reg');
        req.session.user = user;    //save the user info into session
        req.flash('success', 'Registration successful!');
        res.redirect('/');          //and back to the homepage
      });
    });
  });



/*login page, GET POST request*/
router.route('/login')
  .all(checkNotLogin)      //the user has to be in the not logged-in state to be on this page
  .get(function(req, res){
    res.render('login', {
      title: 'Login',
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  })

  .post(function(req, res){
    //password encryption
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('hex');

    //check if the user exist
    User.get(req.body.name, function (err, user) {
      errorRedirect(err, '/');
      //if the user doesn't exist redirect to login page
      if (!user) {
        req.flash('error', 'The user does not exist!');
        return res.redirect('/login');
      }
      //if user exist thencheck the password. if wrong, redirect to login page
      if (user.password != password) {
        req.flash('error', 'Nice try! But wrong password!');
        return res.redirect('/login');
      }
      //if both username and password are right, store the user info into session and jump to the hompage
      req.session.user = user;
      req.flash('success', 'Logged in successful!');
      res.redirect('/');
    });
  });


/*posting page*/
router.route('/post')
  .all(checkLogin)                //has to a logged in user to post
  .get(function(req, res){
    res.render('post', {
      title: 'Post',
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  })
  .post(function(req, res){
    var currentUser = req.session.user;
    var post = new Post(currentUser.name, req.body.title, req.body.post);
    post.save(function (err) {
      errorRedirect(err, '/');
      req.flash('success', 'Submission successful!');
      res.redirect('/');      //back to main
    });
  });



//one user's page, with 10 posts per page
router.route('/u/:name')
  .get(function (req, res) {
    var page = req.query.p ? parseInt(req.query.p) : 1;
    //check the existance of the user
    User.get(req.params.name, function (err, user) {
      if (!user) {
        req.flash('error',  'The user does not exist!');
        return res.redirect('/');
      }
      //call Post.getTen to display 10 posts per page
      Post.getTen(user.name, page, function (err, posts, total) {
        errorRedirect(err, '/');
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


//render one particular posting
router.route('/p/:_id')
  .get(function(req, res){
    //retrieve one article from Post model
    Post.getOne(req.params._id, function (err, post) {
      errorRedirect(err, '/');
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
  .all(checkLogin)
  .get(function(req, res){
    var currentUser = req.session.user;
    Post.getOne(req.params._id, function (err, post) {
      errorRedirect(err, 'back');
      res.render('edit', {
        title: 'Edit',
        post: post,
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
      });
    });
  })
  .post(function(req, res){
    var currentUser = req.session.user;
    Post.update(req.params._id, req.body.title, req.body.post, function (err) {
      var url = encodeURI('/p/' + req.params._id);
      errorRedirect(err, url);
      req.flash('success', 'Edit successful!');
      res.redirect(url);  //back to the url
    });
  });

router.route('/remove/p/:_id')
  .all(checkLogin)
  .get(function(req, res){
    var currentUser = req.session.user;
    Post.remove(req.params._id, function (err) {
      errorRedirect(err, 'back');
      req.flash('success', 'Delete successful!');
      res.redirect('/');
    });
  })

/*logout page*/
router.route('/logout')
  .all(checkLogin)              //has to a logged in user to log out
  .get(function(req, res){
    req.session.user = null;    //set the current session user to null
    req.flash('success', 'Log out successful!');
    res.redirect('/');          //back to the homepage

  })








//testing, attention plz
router.route('/food')
  .get(function(req,res){          //testing, delete later
    res.send('Ayy lmao');
  });




//if encounter error, redirect to url
function errorRedirect(err, url ){
  if (err) {
    req.flash('error', err);
    return res.redirect(url); //error! goes back to the url
  }
};

//check user state
// the page requires logged in user
function checkLogin(req, res, next) {
  if (!req.session.user) {
    req.flash('error', 'Please login first!');
    res.redirect('/login');
  }
  next();
};

//the pages requires not logged in user, eg, login, registration page
function checkNotLogin(req, res, next) {
  if (req.session.user) {
    req.flash('error', 'Already logged in!');
    res.redirect('back');
  }
  next();
};


module.exports = router;
