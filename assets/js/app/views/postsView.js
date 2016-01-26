//collection-view class
//Note: place the logics in collections, and then call the corresponding logics in the view to utilize

//import libraries
var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;                                         //setup dependencies with jquery
var Handlebars = require('handlebars');                 //compile template in client side

//import components
var PostView        = require('../views/postView.js');          //single post component
var PaginationView  = require('../views/paginationView.js');    //pagination component
var CreateView      = require('../views/createView.js');        //post creation component



// tagging and apending rendered collection is dealt at router
var PostsView = Backbone.View.extend({
  el: '#backbone_app',                                            //top el is #backbone_app
  _subviews: [],                                                  //manage all subviews



  initialize: function(){
    this.listenTo(this.collection, 'setPage', this.index);        //listener to setPage event from posts collection
    //this.listenTo(this.collection, 'create', this.create);      //listener to create event
  },

  /*
  *views: these are the top views, subview componenet are appended
  */
  //index(): clear the elemnts, render the posts, render pagination
  index: function() {
    console.log('index: makesure render once');
    this.removeContent();
    this.addAll();              //render the posts
    this.pagination();          //render pagination
  },


  //create new post
  create: function() {
    console.log('create: makesure render once');
    this.removeContent();                        //clear
    var createView = new CreateView({collection: this.collection});
    this.$el.append(createView.render().el);
  },



  //show the desired post, by id
  showOnePost: function(_id) {
    var post = this.collection.get(_id);
    //console.log(post);
    this.removeContent();
    this.addOne(post);
  },

  /*
  showUserPosts: function(username) {
    console.log(username);
    var posts = this.collection.where({name: username});

  },
  */

  /*
  * components, which can be added on views
  */
  //one post
  addOne: function(post) {
    var postView = new PostView({model: post});         //instantiate postView with model data
    this.$el.append(postView.render().el);              //append a view, with rendered element
    this._subviews.push(postView);                      //push the reference to the _subviews so that it can be manipulated later
  },

  //all posts from current page
  addAll: function() {
    var page = this.collection.state.currentPage;                         //retrieve the currentPage
    this.collection.setPage(page).forEach(this.addOne, this);             //Note: only forEach works, each only can be invoked on collection itself. setPage() uses slice() which returns an array
  },


  //pagination
  pagination: function() {
    var pagination = new PaginationView({collection: this.collection});   //instantiate pagination component
    this.$el.append(pagination.render().el);                              //append pagination component
    this._subviews.push(pagination);
  },



  //utilities
  //remove the views from the _subviews
  removeContent: function() {
    _.invoke(this._subviews, 'remove');       //invoke remove() on all the subviews
    this._subviews.length = 0;
  },


});


//everytime
module.exports = PostsView;
