Since the ejs comments system is not working for now:

Main page:
index.ejs

Registration and login:
login.ejs
reg.ejs

A user's posts collection page:
user.ejs

To post a new article:
post.ejs



Mitigating in process:
Post collection from index.ejs page, which iterate through the posts retrieved:
<% posts.forEach(function (post) { %>
  <div class="container">
      <div class="col-lg-8 col-lg-offset-2">

        <a href="/p/<%= post._id %>">
          <p class="post-title"><h2><%= post.title %></h2></p>
        </a>

        <p class="post-meta">
          Author: <a href="/u/<%= post.name %>"><%= post.name %></a>
          Date: <%= post.time.minute %>
        </p>


        <p class="body"><%- post.post %></p>
        <hr>

      </div>
  </div>

<% }) %>


Replaced with bundle.js

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.2.3/backbone-min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js" integrity="sha512-K1qjQ+NcF2TYO/eI3M6v8EiNYZfA95pQumfvcVrTHtwQVDG+aHRqLi/ETn2uB+1JqwYqVG3LIvdm9lj6imS/pQ==" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.0.5/handlebars.min.js"></script>

    <script src="/javascripts/backbone/app.js"></script>
    <script src="/javascripts/backbone/models/model_post.js"></script>
    <script src="/javascripts/backbone/collections/collection_posts.js"></script>
    <script src="/javascripts/backbone/views/view_post.js"></script>
