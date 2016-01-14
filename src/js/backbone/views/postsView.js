//collection-view class
//Note: place the logics in collections, and then call the corresponding logics in the view to utilize

//import libraries
var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;                                         //setup dependencies with jquery
var Handlebars = require('handlebars');                 //compile template in client side

//import custom files
var PostView = require('../views/postView.js');          //collection-view handles single view
//var pagination = require('../templates/PostView.hbs');



// tagging and apending rendered collection is dealt at router
var PostsView = Backbone.View.extend({
  initialize: function(){
    //this.render();            //an echo in console for now
    //this.listenTo(this.collection, 'reset', this.render);
    this.listenTo(this.collection, 'setPage', this.render);      //Warning: cascading call pitfall, do not listen to collection change
  },

  render: function() {
    this.addAll();
    this.pagination();
  },

  //add one rendered view to the top element
  addOne: function(post) {
    var postView = new PostView({model: post});         //instantiate postView with model data
    this.$el.append(postView.render().el);              //append a view, with rendered element

  },

  //render all posts of the current page of the collection
  addAll: function() {
    var page = this.collection.state.currentPage;                       //retrieve the currentPage
    //page = 3;
    this.collection.setPage(page).forEach(this.addOne, this);            //Note: only forEach works, each only can be invoked on collection itself. setPage() uses slice() which returns an array
  },


  //add simple pagination button.
  //for more better component management, use marionette to arrange subviews and component
  pagination: function() {
    var pagination = Handlebars.compile(
      '<div class="container">'+
        '<div class="col-lg-8 col-lg-offset-2">'+
          '<nav>'+
            '<ul class="pager">'+
              '<li class="previous"><a class="backbone" href="/pagee/{{ prev }}"><span aria-hidden="true">&larr;</span> Older</a></li>'+
              '<li><a class="backbone" href="/create">create</a></li>'+
              '<li class="next"><a class="backbone" href="/pagee/{{ next }}">Newer <span aria-hidden="true">&rarr;</span></a></li>'+
            '</ul>'+
          '</nav>'+
        '</div>'+
      '</div>'
    );

    this.$el.append(pagination({
      prev: 1 || (this.collection.state.currentPage-1),
      next: this.collection.state.lastPage || (this.collection.state.currentPage + 1)
    }));

  }



  /*
  //render posts at of the current page of the collection
  currentPage: function() {
    //this.$el.html('');                                //clean the top elemnt
    var page = this.collection.state.currentPage;                       //retrieve the currentPage
    page = 3;
    this.collection.setPage(page).forEach(this.addOne, this);            //Note: only forEach works, each only can be invoked on collection itself. setPage() uses slice() which returns an array

    //pagination
    this.$el.append('<span>test</span>');
  },
  */



});

//everytime
module.exports = PostsView;
