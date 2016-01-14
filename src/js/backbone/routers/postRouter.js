//import libraries
var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;                                     //setup dependencies with jquery

//import custom files
var PostsView = require('../views/postsView.js');   //Collection-view classfor rendering


//
var PostRouter = Backbone.Router.extend({
  routes:{
    ''            : 'index',
    'create'      : 'create',           //create new post
    'pagee/:page' : 'setPage',
    //'prev'        : 'prev',             //to the previous page
    //'next'        : 'next',             //to the next page
    'post/:_id'   : 'post'         //display a single post
  },


  //so that u can initialize with an collection object as the argument
  initialize: function(posts) {
    this.posts = posts;                                           //save the collection object during initialization, so it can be called upon later
    this.postsView = new PostsView({collection: this.posts});     //instantiate a collection view, with the collection passed to the router

  },

  //homepage
  index: function() {
    $('#backbone_app').html(this.postsView.el);
    this.posts.fetch({reset: true});
  },

  setPage: function(page) {
    console.log(page);
    this.posts.setPageEvent(currentPage);
    $('#backbone_app').html(this.postsView.el);
  },

  create: function(){
    console.log('create ready');
  }

  /*
  prev: function(){
    if ( this.collection.state.currentPage !== 1 ) {
      this.collection.state.currentPage -=1;
      this.posts.trigger('reset');
    }
  },

  next: function(){
    if ( this.collection.state.currentPage !== this.collection.state.lastPage ) {
      this.collection.state.currentPage +=1;
      this.posts.trigger('reset');
    }
  },
  */
});



module.exports = PostRouter;
