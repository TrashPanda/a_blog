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
  //className:  'container',                                //recognizable by bootstrap, <div class="container">...</div>
  template:   Handlebars.compile(template),               //Noteto further optimize, use precompile template later

  //load up and render upon initialization
  initialize: function(){
    this.listenTo(this.model, 'change', this.render);       //attatch the view listener to the model
  },

  render: function(){
    //this.$el.html(this.template({msg:'view hbs loading success'}));     //render the template
    this.$el.html(this.template(this.model.toJSON()));      //top element calls html() -> pulls the template -> pass the model data
    //console.log(this.model.toJSON());
    return this;
  }
});



//don't forget to export
module.exports = PostView;
