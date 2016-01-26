//import libraries
var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;                                     //setup dependencies with jquery

//import custom files
var PostsView   = require('../views/postsView.js');   //Collection-view class for list rendering
var CreateView  = require('../views/createView.js');  //view for new post

var app = require('../app.js');


//
var PostRouter = Backbone.Router.extend({
  routes:{
    ''            : 'homepage',
    //'create'      : 'create',               //create new post
    'page/:page'  : 'setPage',              // navigate to the designated page
    'post/:_id'   : 'showOnePost',          //display a single post
    //'user/:username'  : 'showUserPosts'
  },

  //initialize the router with collection, instantiate the collection-view, only after successful fetch(), router.start() is passed as callback to kickstart history api and url monitoring
  initialize: function(posts, callback) {

  },


  //after the initialization of router and the render of the initial page complete, start the history
  start: function(){
    Backbone.history.start( {pushState: true} );        //enable pushstate, instead of #]
  },

  /*
  state changing routing is handled through custom events in collection
  */

  //state homepage: calls homepageEvent() function in collection
  homepage: function() {
    app.posts.homepageEvent();
  },


  //state change: set current page with page param
  setPage: function(page) {
    app.posts.setPageEvent(page);
  },


  //create page
  create: function(){
    app.postsView.create();
  },

  //single post page
  showOnePost: function(_id) {
    app.postsView.showOnePost(_id);
  },

  //a user's post page
  showUserPosts: function(username) {
    this.postsView.showUserPosts(username);
  }


});



module.exports = PostRouter;
