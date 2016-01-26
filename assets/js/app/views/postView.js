//backbone app: ModelView for model_post
//import libraries
var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;                                         //setup dependencies with jquery
var Handlebars = require('handlebars');                 //compile template in client side

//import custom files
var template = require('../templates/PostView.hbs');    //template for a single post



// model-view corresponding to a single post Model
//trying out handlebar
var PostView = Backbone.View.extend({
  template:   Handlebars.compile(template),               //Noteto further optimize, use precompile template later

  render: function(){
    //top element calls html() -> pulls the template -> pass the model data
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  }

});



//don't forget to export
module.exports = PostView;
