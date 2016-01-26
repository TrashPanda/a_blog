/*
Overview:
main app.js for Backbone
it also acts as a global event dispatcher

to make the codes modular, avoid direct dependencies when nacessary:
user input -> event dispatcher -> model update -> view update


*/


//import libraries
var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;                         //setup dependencies with jquery


//initialization for view/outer/model
function _initializeModels(app) {
  //require and instantiate a collection
  app.Posts = require('./collections/posts.js');
  app.posts = new app.Posts();
}



function _initializeViews(app) {
  //require and instantiate view, with posts object
  app.PostsView = require('./views/postsView.js');
  app.postsView = new app.PostsView( {collection: app.posts} );   //instantiate the collection-view
}



function _initializeRouters(app) {
  app.PostRouter  = require('./routers/postRouter.js');
  app.router = new app.PostRouter();
  //after initial fetch, start the router
  app.listenToOnce(app.posts, 'sync', function(){
    app.router.start();
  });
}




function _initializeGlobalEvents(app) {
  //unless marked by data-bypass="true", a click action will be registered by router
  $(window.document).on('click', 'a[href]:not([data-bypass])', function(e) {
    if (!e.metaKey && !e.ctrlKey && !e.shiftKey) {
      var protocol = this.protocol + '//';        //for example https://eg.com/page1, var protocol = 'https:' + '//'

      //process href before continuing
      var href = this.href;                       //href  = https://eg.com/page1
      href = href.slice(protocol.length);         //href  = eg.com/page1
      href = href.slice(href.indexOf("/") + 1);   //href  = page1

      if (href.slice(protocol.length) !== protocol) {
        e.preventDefault();
        // let the backbone router to handle
        Backbone.history.navigate(href, true);
      }
    }
  });
}



//the start function, all other initialization function are invoked here
function start(app) {
  _initializeGlobalEvents(app);
  //initialize assets. order matters
  _initializeModels(app);
  _initializeViews(app);
  _initializeRouters(app);
  //initial fetch
  app.posts.fetch({
    //reset: true,
    success: function(){
      //console.log('fetch success');
    }
  });
}


//create namespace for our blog app
var app = {
};


//let app object becomes an event dispatcher
_.extend(app, Backbone.Events);




//import custom modules
//var Post        = require('./models/post.js');
//app.PostView    = require('./views/postView.js');


//route event
/*
app.on('route', function (path) {
  app.router.navigate(path, {trigger: true});
});

app.on('collectionEvent1', function () {
  app.trigger('dispatcher:C');
});
*/






/*
//testing
console.log('backbone success');
*/






// then instantiate router, start the router after the index page rendering complete, to make sure links are monitored by router
module.exports = app;

start(app);
