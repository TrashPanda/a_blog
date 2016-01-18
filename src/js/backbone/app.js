//main app.js for Backbone
//import libraries
var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;                         //setup dependencies with jquery

//create namespace for our blog app
var app = {
//defining subset of Models Posts are too repetitive, just use convention
};

//import custom modules
app.Post        = require('./models/post.js');
app.Posts       = require('./collections/posts.js');
app.PostView    = require('./views/postView.js');
app.PostsView   = require('./views/postsView.js');
app.PostRouter  = require('./routers/postRouter.js');





/*
//testing
console.log('backbone success');
*/


//instantiate a collection
app.posts = new app.Posts();

// then instantiate router, start the router after the index page rendering complete, to make sure links are monitored by router
app.router = new app.PostRouter( app.posts, function(){
  $(function(){
    app.router.start();
  });
});
