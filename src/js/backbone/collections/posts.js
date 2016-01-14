//backbone app: Collection
//import libraries
var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;                           //dependencies with jquery

//import custom files
var Post = require('../models/post.js');  //Model-Collection



//Collection for the post Model
//with the philosophy of flux, we always 2 types of the function
//event function: update the state and send the trigger
//update function: return the updated collection
var Posts = Backbone.Collection.extend({
  model:  Post,
  url:    '/api/posts',

  //pagination state flag
  state: {
    firstPage:     1,
    lastPage:     null,
    currentPage:  null,
    pageSize:     6,            //number of posts per page. it can be set as a parameter of initialize function, but now let's just make it 6
    totalRecords: null,
    totalPages:   null,
    currentPosts: null,
  },


  initialize:  function() {
    this.on('reset', this.setState);
  },


  //bootstraping, set up state for initialization
  setState: function() {
    this.state.totalRecords = this.length;    //retrieve total number of posts
    this.state.currentPage  = 1;              //set current page to 1

    //then calculate the total pages with above
    var totalPages = Math.ceil(this.state.totalRecords / this.state.pageSize);

    this.state.totalPages   = totalPages;     //calculate the total number of pages
    this.state.lastPage     = totalPages;     //set the last page based on total pages

    //return this.setPage(this.state.firstPage);   //return the list of the posts at first page
    this.setPageEvent(this.state.firstPage);
  },




  //the event part, change state and fire trigger
  setPageEvent: function(page) {
    this.state.currentPage = page;                                // set the current page
    this.trigger('setPage');
  },


  //the update part, return the update
  setPage: function() {
    var start = this.state.pageSize*(this.state.currentPage-1);   // the starting post and the ending post for this page
    var end   = this.state.pageSize*this.state.currentPage;       // the number of posts displayed equals pageSize, omit is automatically dealt with in array.slice() method.
    //this.trigger('setPage');
    var update = this.slice(start, end);             // store the shallow copy of a list of  the post models
    return update;
  },

  /*rewrite this part to saperate event and update
  setPage: function(page) {
    this.state.currentPage = page;                                // set the current page
    //this.trigger('setPage');

    var start = this.state.pageSize*(this.state.currentPage-1);   // the starting post and the ending post for this page
    var end   = this.state.pageSize*this.state.currentPage;       // the number of posts displayed equals pageSize, omit is automatically dealt with in array.slice() method.
    //this.trigger('setPage');
    return this.slice(start, end);                                // return the shallow copy of a list of  the post models on the page
  },
  */



});

//Usage:
//To fetch a certain page, pass the page_number, default starts from one: test.fetch({data: $.param({ p: <page_number>})});

module.exports = Posts;
