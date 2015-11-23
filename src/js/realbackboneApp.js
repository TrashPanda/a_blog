// app js for Backbone
var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;                       //setup dependencies with jquery

/*
/post         : empty;  GET all articles
/post         : JSON;   POST create an article
/post/u/:name : empty;  GET all articles from user:name
/post/:id     : empty;  GET an article from id:id
/post/:id     : JSON;   PUT update
/post/:id     : empty;  DELETE an article
*/


//Model for the post
var Post = Backbone.Model.extend({
  defaults: {
  },
  urlRoot: '/post'
});


//Collection for the post
var Posts = Backbone.Collection.extend({
  model:  Post

});

//View
var PostView = Backbone.View.extend({
  render: function(){

  }
});



console.log(Backbone);
