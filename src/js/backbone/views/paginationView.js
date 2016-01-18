//collection-view class
//Note: place the logics in collections, and then call the corresponding logics in the view to utilize

//import libraries
var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;                                         //setup dependencies with jquery
var Handlebars = require('handlebars');                 //compile template in client side

//tempalte
var template = require('../templates/PaginationView.hbs');    //template for a single post



var PaginationView = Backbone.View.extend({
    template:   Handlebars.compile(template),

    render: function(){
      // pass down the states of the previous page and next page
      this.$el.html(this.template({
        prev: this.collection.state.prev,
        next: this.collection.state.next
      }));
      return this;
    }
});


module.exports = PaginationView;
