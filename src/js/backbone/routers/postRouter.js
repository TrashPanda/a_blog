//import libraries
var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;                                     //setup dependencies with jquery

//import custom files
var PostsView   = require('../views/postsView.js');   //Collection-view class for list rendering
var CreateView  = require('../views/createView.js');  //view for new post


//
var PostRouter = Backbone.Router.extend({
  routes:{
    ''            : 'homepage',
    'create'      : 'create',           //create new post
    'page/:page'  : 'setPage',          // navigate to the designated page
    'post/:_id'   : 'showOnePost',       //display a single post
    //'user/:username'  : 'showUserPosts'
  },

  //initialize the router with collection, instantiate the collection-view, only after successful fetch(), router.start() is passed as callback to kickstart history api and url monitoring
  initialize: function(posts, callback) {
    this.posts = posts;                                         //pass in the collection
    this.postsView = new PostsView({collection: this.posts});   //instantiate the collection-view
    this.posts.fetch({
      //reset: true,
      success: function(){
        callback();
      }
    });
  },


  //after the initialization of router and the render of the initial page complete, start the history
  start: function(){
    Backbone.history.start( {pushState: true} );        //enable pushstate, instead of #]

    //unless marked by data-bypass="true", a click action will be registered by router
    $(window.document).on('click', 'a[href]:not([data-bypass])', function(e) {
      if (!e.metaKey && !e.ctrlKey && !e.shiftKey) {
        var protocol = this.protocol + '//';        //for example https://eg.com/page1, var protocol = 'https:' + '//'

        //process href before continuing
        var href = this.href;                       //href  = https://eg.com/page1
        href = href.slice(protocol.length);         //href  = eg.com/page1
        href = href.slice(href.indexOf("/") + 1);   //href  = page1

        if (href.slice(protocol.length) !== protocol) {
          e.preventDefault();
          // let the backbone router to handle
          Backbone.history.navigate(href, true);
        }
      }
    });
  },

  /*
  state changing routing is handled through custom events in collection
  */

  //state homepage: calls homepageEvent() function in collection
  homepage: function() {
    this.posts.homepageEvent();
  },


  //state change: set current page with page param
  setPage: function(page) {
    this.posts.setPageEvent(page);
  },


  //create page
  create: function(){
    this.postsView.create();
  },

  //single post page
  showOnePost: function(_id) {
    this.postsView.showOnePost(_id);
  },

  //a user's post page
  showUserPosts: function(username) {
    this.postsView.showUserPosts(username);
  }


});



module.exports = PostRouter;
