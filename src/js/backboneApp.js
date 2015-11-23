// this is a TEMPORARY test run
// app js for Backbone
var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;                       //setup dependencies with jquery


//Model Class
var Blog = Backbone.Model.extend({
  defaults: {
    author: 'test',
    title: 'test1',
    url: ''
  },

  //define the function in the Model and calls it from View
  tokenAction: function(){
    //do something in the next line, then call save()
    //:do something like this.set();
    this.save();
  }
});


//Collection Class
var Blogs = Backbone.Collection.extend({
  model: Blog                               // pass the Blog Model object as the parameter
});




//Model View Class for 1 blog
var BlogView = Backbone.View.extend({
  model: new Blog(),
  tagName: '',
  template: '',
  //events trigger
  events: {

  },

  initialize: function() {

  },
  //rendering elements in the DOM
  render: function(){

  },
  //vView calls Model to do the action
  tokenAction: function(){
    this.model.tokenAction();
  }
});


//Collection View Class
var BlogsView = Backbone.View.extend({
  initialize: function() {

  },
  render: function() {
    // calls Collection forEach(this.addOne, this);
  }
});










//instantiate
var blog1 = new Blog({
  author: 'food',
  title: 'book',
  url: 'http://food.come'
});

var blog2 = new Blog({
  author: 'food1',
  title: 'boo2',
  url: 'http:read'
});

var blogs = new Blogs([blog1,blog2])
var blog3 = new Blog();
blog3.get('author');

console.log(blogs.length);
console.log('testing');
