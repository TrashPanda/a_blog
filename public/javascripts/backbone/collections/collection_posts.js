//Collection for the post Model
BlogApp.posts = Backbone.Collection.extend({
  model:  BlogApp.post,
  url:  '/api/posts'

});



//Usage:
//To fetch a certain page, pass the page_number, default starts from one: test.fetch({data: $.param({ p: <page_number>})});
