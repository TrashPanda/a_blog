//view for creat a new post

//import libraries
var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;                                         //setup dependencies with jquery
var Handlebars = require('handlebars');                 //compile template in client side

//import template
var template = require('../templates/CreateView.hbs');  //template for creating new component
//var template = require('../templates/testForm.hbs');  //template for creating new component

var CreateView = Backbone.View.extend({
  template:   Handlebars.compile(template),
  events: {
    'click button': 'createNew'
  },

  //render the form for new post submission
  render: function() {
    console.log('createview readey');
    //console.log(this.collection.state);
    this.$el.html('');
    this.$el.html(this.template());
    return this;
  },


  //create a new post and save it into the collection
  createNew: function(e) {

    e.preventDefault();                         //prevent the default submit action

    //extract data [{name:'title', value:'titleContent'},{name:'post',value:'postContent'}]
    var input = this.$('form').serializeArray();
    //console.log(input);

    //transfrom data to {title: 'titleContent', post: 'postContent'}
    var newPost = input.reduce(function(obj, item) {  //extract input as object
      obj[item.name] = item.value;                    //start from an empty object and use reduce() to iterate and add properties
      return obj;
    }, {});


    //calls collection to save and update the new post
    this.collection.newPostEvent(newPost);

  }

});



module.exports = CreateView;
