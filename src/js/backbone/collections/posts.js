//backbone app: Collection

//import libraries
var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;                           //dependencies with jquery

//import custom files
var Post = require('../models/post.js');  //Model-Collection



//Collection for the post Model
//with the philosophy of one way data flow, we always 2 types of the function
//event function: update the state and send the trigger
//update function: return the updated collection
//
//Flow:
// view receive change-> model update -> update completion trigger view re-render
//1. user interction on view/router, inform model incoming change
//2. model update the change
//3. upon update completion, model send trigger to view
//4. view re-render to reflect the changes
//
//Philosophy:
//All logics r in collection/model, no intervining trigger web, data only go one way

var Posts = Backbone.Collection.extend({
  model:  Post,
  url:    '/api/posts',

  //state machine
  state: {
    firstPage:     1,
    lastPage:     null,
    currentPage:  null,
    pageSize:     5,            //number of posts per page. it can be set as a parameter of initialize function, but now let's just make it 6
    totalRecords: null,
    totalPages:   null,
    //currentPosts: null,
    prev:         null,
    next:         null,
  },


  initialize:  function() {
    this.on('sync', this.initializeState, this);                   //initialize state with fetched collection
  },


  //initialize state with fetched collection
  initializeState: function() {
    this.state.totalRecords = this.length;    //retrieve total number of posts
    this.state.currentPage  = 1;              //set current page to 1
    this.state.prev         = 1;
    this.state.next         = 1;

    //then calculate the total pages with above
    var totalPages = Math.ceil(this.state.totalRecords / this.state.pageSize) || 1;

    this.state.totalPages   = totalPages;     //calculate the total number of pages
    this.state.lastPage     = totalPages;     //set the last page based on total pages


    //return this.setPage(this.state.firstPage);   //return the list of the posts at first page
    //this.setPageEvent(this.state.firstPage);
  },




  //the events: router setup the event through routing
  //after receive user event, change state(in a general sense) and fire trigger

  //set designated current page
  setPageEvent: function(page) {
    var page = parseInt(page);                                    //parse the partial url string to number
    this.state.currentPage = page;                                // set the current page

    // set the next/prev page for pagination
    if ( page !== 1) {
      this.state.prev = page - 1;
    }

    if ( page !== this.state.lastPage) {
      this.state.next = page + 1;
    }

    console.log(page, this.state);
    this.trigger('setPage');
  },


  //back to the office!
  homepageEvent:function(){
    //if (this.state.currentPage !== 1) {
      //console.log('collection lenght ' + this.length);
    console.log('did this trigger?');
    this.setPageEvent(1);
    //}
  },

  /*
  createEvent: function(){
    console.log('trigger create');
    //this.state.currentPage = 'create';
    this.trigger('create');
  },
  */

  newPostEvent: function(newPost){
    console.log(newPost);

    this.create({                     //create, save and sync a new post model
      name:   null,
      title:  newPost.title,
      post:   newPost.post,
      time:   null
    }, { parse: false } );

    // redownload collection is required here because name/time are snapped on from server side for now
    // to get  around, sync when there is a change in collection
    /*
    * navigate to root
    */
  },

  showOnePostEvent: function(_id){
    console.log(_id);
    this.state.currentPage = 'showOnePost';
    this.trigger('showOnePost');
  },


  //the collection(or model in a general sense) update part, return the update
  //
  setPage: function() {
    var start = this.state.pageSize*(this.state.currentPage-1);   // the starting post and the ending post for this page
    var end   = this.state.pageSize*this.state.currentPage;       // the number of posts displayed equals pageSize, omit is automatically dealt with in array.slice() method.


    var update = this.slice(start, end);             // store the shallow copy of a list of  the post models
    //console.log('current length'+this.length);
    //console.log(update);
    return update;
  },



});

//Usage:
//To fetch a certain page, pass the page_number, default starts from one: test.fetch({data: $.param({ p: <page_number>})});

module.exports = Posts;
