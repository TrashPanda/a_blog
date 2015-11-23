To use the original css, add this link after title:
<link rel="stylesheet" href="/stylesheets/main.css">

To use bootstrap:
check bootstrap website

navbar:

<nav>
  <span><a title="home" href="/">home</a></span>
  <% if (user) { %>
  <span><a title="new post" href="/post">new post</a></span>
  <span><a title="log out" href="/logout">log out</a></span>
  <% } else { %>
  <span><a title="login" href="/login">login</a></span>
  <span><a title="registration" href="/reg">register</a></span>
  <% } %>
</nav>


<form method="post" class="form-horizontal">
  <div class="form-group">
    <label for="article-title">Title</label>
  </div>

  <div class="form-group">
    <input class="form-control" type="text" id="article-title" value="<%= post.title %>" required/>
  </div>

  <div class="form-group">
    <label for="article-body">Body</label>
  </div>

  <div class="form-group">
    <textarea class="form-control" id="article-body" rows="20" cols="100" required><%= post.post %></textarea>
  </div>

  <div class="form-group">
    <button type="submit" class="btn btn-primary">Submit</button>
  </div>
</form>

<div class="container text-center">
  <div class="row">
    <form method="post" class="col-md-4 col-md-offset-4">

      <div class="form-group">
        <input class="form-control" type="text" name="name" placeholder="Enter your username" required/>
      </div>


      <div class="form-group">
        <input class="form-control" type="password" name="password" placeholder="Enter your assword" required/>
      </div>


      <div class="form-group">
        <input class="form-control" type="password" name="password-repeat" placeholder="Confirm your Password" required/>
      </div>


      <div class="form-group">
        <input class="form-control" type="email" name="email" placeholder="Enter your email" required/>
      </div>

      <div class="form-group">
        <button type="submit" class="btn btn-primary">Register</button>
      </div>
    </form>
  </div>
</div>
