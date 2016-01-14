//backbone app: Model post
//import libraries
var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;                         //setup dependencies with jquery



// Model for single post
var Post = Backbone.Model.extend({
  //4 attributes
  defaults:{
    name: null,                  //name: username
    title:  null,               //title: post title
    post: null,                 //body: post body
    time: null                  //time: time stamp of the post, note that in this case it's an object with various format of time, it will be parsed
  },

  //set id attribute of this model to _id to match mongoDB
  //remember to use _id instead of id in fetch
  idAttribute: "_id",

  //resorce url
  //if id is not present, POST request is expected
  //if id is present, PUT/DELETE/GET request are expected, /posts/:_id is picked
  //seems that backbone doesn't support fetch by id, where u do var test=new Model(); test.fetch({_id: 111}). u can only parsed the id during model instantiation, so: var test =new Model({_id:111}); test.fetch();

  url: function () {
    return this.id ? '/api/posts/' + this.id : '/api/posts';
  },

  //parse the response data from server
  //in this case it is nexted with time object which need to be parsed.
  parse: function(response) {
    var parsed = response;                  //create a new object with all attributes from response
    parsed.time = response.time.minute;     //passed desired data minute to the parsed object under time to match the model
    return parsed;
  }

});



module.exports = Post;
