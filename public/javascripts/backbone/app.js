//seems this doesn't work, i need browserify/requirejs/webpack now
//this is the app to kickstart
//initializing the app object is necessary
var BlogApp = {

};             //create  namespace


//router controls the route
// pagination:
// create new post:
// edit/delete:

BlogApp.Router = Backbone.Router.extend({
  routes: {
    ''  : 'test'          // a simple route to test the if the view is working
  },

  test: function(){
    var test = new BlogApp.post({_id: '56707de950901c3f2af6cb43'});
    test.trigger(reset);
  }

});



// instatiate a router
BlogApp.router = new BlogApp.Router();
Backbone.history.start({pushState: true});






/*
//testing: this will change the test element from 'loading', to 'testing success!'
//define the testing class
var TestView = Backbone.View.extend({
  el: '#testing',

  template: Handlebars.compile("<span>handlebars testing<span>"),

  initialize: function(){
    this.render();
  },

  render: function(){
    //this.$el.html("testing success!");
    this.$el.html(this.template);
  }

});


//initialize
//Note: initialization of Backbone is arbitary, we just need to instantiate it for the browser to process
var testView = new TestView();
//testing successful, this backbone app is rendered in browser
*/

//var test = new BlogApp.posts();
//var modelTest = new BlogApp.post();
//var postViewTest = new BlogApp.postView();
