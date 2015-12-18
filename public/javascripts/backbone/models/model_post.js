BlogApp.post = Backbone.Model.extend({
  //4 attributes
  defaults:{
    name: null,     //name: username
    title:  null,   //title: post title
    post: null,     //body: post body
    time: null      //time: time stamp of the post, note that in this case it's an object with various format of time
  },

  //set id attribute of this model to _id to match mongoDB
  //remember to use _id instead of id in fetch
  idAttribute: "_id",

  //resorce url
  //if id is not present, POST request is expected
  //if id is present, PUT/DELETE/GET request are expected, /posts/:_id is picked
  url: function () {
    return this.id ? '/api/posts/' + this.id : '/api/posts';
  }

});
