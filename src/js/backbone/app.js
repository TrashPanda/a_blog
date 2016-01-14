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
console.log('success');
*/


//browserify testing cannot be done in console, so it's written here

app.posts = new app.Posts();


//app.postsView = new app.PostsView({collection: app.posts});
app.router    = new app.PostRouter( app.posts );    //instantiate the router with an collection object
Backbone.history.start( {pushState: true} );        //enable pushstate, instead of #

$(".backbone").click(function () {
  console.log($(this));
  Backbone.history.navigate($(this).attr('href'), true);
  return false;
});

/*
app.posts.fetch({
  data:     $.param( { p: 2} ),
  //success:  function() {
  //  return console.log(app.posts.toJSON());
  //},
  reset: true

});
*/



/*
var test = new app.Post({ _id: "56707de950901c3f2af6cb43" });

var TestView = Backbone.View.extend({
  el: '#bb_testing',

  initialize: function(){
    //test.on('change', this.render, this);
    this.listenTo(test, 'change', this.addOne);

    test.fetch({
      //success callback
      success: function() {
        return console.log(test.toJSON());      // verify the model fetch in console
      }
    });
  },

  addOne: function(model){
    var postView = new app.PostView({ model: model });
    this.$el.append(postView.render().el);
    //this.$el.html(this.template({msg:'hbs loading success'}));
    console.log('addOne called');
    return this;
  }
});

var testView = new TestView();
*/


/*
var test = new app.Models.Post({ _id: "56707de950901c3f2af6cb43" });

//model fetching test
test.fetch({
  //success callback
  success: function() {
    return console.log(test.toJSON());      // verify the model fetch in console
  }

});
console.log(test);
//console.log(test.toJSON());
*/


/*
var test2 = new app.Collections.Posts();
test2.fetch({data: $.param({ p: 1 })});
console.log(test2);
*/


/*
var TestView = Backbone.View.extend({
  el: '#bb_testing',

  template: _.template('<span>view initialization success</span>'),
  initialize: function(){
    this.render();
  },
  render: function(){
    this.$el.html(this.template());
    return this; // enable chained calls
  }
});
*/



//browserify testing cannot be done in console, so it's written here
