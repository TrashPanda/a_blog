// model-view corresponding to a single post Model
//trying out handlebar
BlogApp.postView = Backbone.View.extend({
  el:         '#bb_testing',
  tagName:    'div',              //wrapped in <div class="container"></div> for bootstrap to identify
  className:  'container',

  template: Handlebars.compile(
      '<div class="col-lg-8 col-lg-offset-2">'+

        '<a href="/p/{{ _id}}>'+                                  //_id should be fine, after inspecting JSON data retrieved from the posts collection
          '<p class="post-title"><h2>{{ title }}</h2></p>'+
        '</a>'+

        '<p class="post-meta">'+
          'Author: <a href="/u/{{ name }}">{{ name }}</a>'+
          //Date:  post.time.minute %>
        '</p>'+


        '<p class="body">{{ post }}</p>'+
        '<hr>'+

      '</div>'
  ),

  //initialize function for 1 post
  initialize: function(){
    this.render();
  },

  render: function(){
    this.$el.html(this.template(this.model.toJSON));
    return this;
  }
});
