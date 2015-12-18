//this is the app to kickstart
//define the testing class
var TestView = Backbone.View.extend({
  el: '#testing',

  initialize: function(){
    this.render();
  },

  render: function(){
    this.$el.html("testing success!");
  }
});


//initialize
//Note: initialization of Backbone is arbitary, we just need to instantiate it for the browser to process
var testView = new TestView();
//testing successful, this backbone app is rendered in browser



//initialize the app
var BlogApp = {};
